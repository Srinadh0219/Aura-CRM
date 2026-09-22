import { Module } from '@nestjs/common';
import { NamespacesController } from './namespaces/namespaces.controller';
import { NamespacesService } from './namespaces/namespaces.service';
import { ModulesController } from './modules/modules.controller';
import { ModulesService } from './modules/modules.service';
import { FieldsController } from './fields/fields.controller';
import { FieldsService } from './fields/fields.service';
import { RecordsController } from './records/records.controller';
import { RecordsService } from './records/records.service';

@Module({
  controllers: [
    NamespacesController,
    ModulesController,
    FieldsController,
    RecordsController,
  ],
  providers: [
    NamespacesService,
    ModulesService,
    FieldsService,
    RecordsService,
  ],
  exports: [
    NamespacesService,
    ModulesService,
    FieldsService,
    RecordsService,
  ],
})
export class ComposeModule {}
