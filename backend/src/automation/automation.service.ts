import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateAutomationRuleDto, UpdateAutomationRuleDto } from './dto/automation.dto';

@Injectable()
export class AutomationService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
  ) {}

  async create(dto: CreateAutomationRuleDto) {
    const module = await this.prisma.module.findUnique({ where: { id: dto.moduleId } });
    if (!module) throw new NotFoundException('Module not found');

    return this.prisma.automationRule.create({
      data: {
        moduleId: dto.moduleId,
        name: dto.name,
        triggerEvent: dto.triggerEvent,
        conditionField: dto.conditionField || null,
        conditionOperator: dto.conditionOperator || null,
        conditionValue: dto.conditionValue || null,
        actionType: dto.actionType,
        actionPayload: dto.actionPayload,
        isActive: dto.isActive !== undefined ? dto.isActive : true,
      },
    });
  }

  async findAll(moduleId?: string) {
    const where: any = {};
    if (moduleId) where.moduleId = moduleId;

    return this.prisma.automationRule.findMany({
      where,
      include: {
        module: {
          select: { id: true, name: true, handle: true, namespaceId: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const rule = await this.prisma.automationRule.findUnique({
      where: { id },
      include: { module: true },
    });
    if (!rule) throw new NotFoundException('Automation rule not found');
    return rule;
  }

  async update(id: string, dto: UpdateAutomationRuleDto) {
    await this.findOne(id);
    return this.prisma.automationRule.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.automationRule.delete({ where: { id } });
  }

  /**
   * Evaluates automation rules for a given event and returns potentially modified record values
   */
  async evaluateRules(
    event: 'RECORD_CREATED' | 'RECORD_UPDATED',
    moduleId: string,
    recordValues: Record<string, any>,
    user?: { id?: string; firstName?: string; lastName?: string; email?: string },
  ): Promise<Record<string, any>> {
    try {
      const activeRules = await this.prisma.automationRule.findMany({
        where: {
          moduleId,
          triggerEvent: event,
          isActive: true,
        },
      });

      let updatedValues = { ...recordValues };

      for (const rule of activeRules) {
        let conditionMatched = true;

        if (rule.conditionField && rule.conditionOperator && rule.conditionValue) {
          const actualVal = String(updatedValues[rule.conditionField] || '').trim();
          const targetVal = String(rule.conditionValue).trim();

          switch (rule.conditionOperator) {
            case 'EQUALS':
              conditionMatched = actualVal.toLowerCase() === targetVal.toLowerCase();
              break;
            case 'NOT_EQUALS':
              conditionMatched = actualVal.toLowerCase() !== targetVal.toLowerCase();
              break;
            case 'CONTAINS':
              conditionMatched = actualVal.toLowerCase().includes(targetVal.toLowerCase());
              break;
            default:
              conditionMatched = true;
          }
        }

        if (conditionMatched) {
          try {
            const payload = JSON.parse(rule.actionPayload);
            if (rule.actionType === 'SET_FIELD' && payload.targetField && payload.value !== undefined) {
              updatedValues[payload.targetField] = payload.value;
            }

            // Log automation execution
            await this.auditService.log({
              userId: user?.id,
              userName: user ? `${user.firstName} ${user.lastName}` : 'System Automation',
              userEmail: user?.email || 'automation@auracrm.local',
              action: 'AUTOMATION_TRIGGERED',
              entityType: 'AUTOMATION',
              entityId: rule.id,
              details: {
                ruleName: rule.name,
                event,
                actionType: rule.actionType,
                payload,
              },
            });
          } catch (pErr) {
            console.error(`Failed to parse/execute payload for rule ${rule.name}`, pErr);
          }
        }
      }

      return updatedValues;
    } catch (err) {
      console.error('Error evaluating automation rules:', err);
      return recordValues;
    }
  }
}
