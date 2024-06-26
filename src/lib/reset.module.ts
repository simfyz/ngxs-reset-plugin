import {
  ENVIRONMENT_INITIALIZER,
  EnvironmentProviders,
  makeEnvironmentProviders,
  ModuleWithProviders,
  NgModule,
} from '@angular/core';
import { NGXS_PLUGINS, withNgxsPlugin } from '@ngxs/store';
import { noop } from './internals';
import { ResetHandler } from './reset.handler';
import { NgxsResetPlugin } from './reset.plugin';
import { ResetService } from './reset.service';

@NgModule()
export class NgxsResetPluginModule {
  static forRoot(): ModuleWithProviders<NgxsResetPluginModule> {
    return {
      ngModule: NgxsResetPluginModule,
      providers: [
        ResetService,
        ResetHandler,
        {
          provide: ENVIRONMENT_INITIALIZER,
          useFactory: noop,
          deps: [ResetHandler],
          multi: true,
        },
        {
          provide: NGXS_PLUGINS,
          useClass: NgxsResetPlugin,
          multi: true,
        },
      ],
    };
  }
}

export function withNgxsResetPlugin(): EnvironmentProviders {
  return makeEnvironmentProviders([
    ResetService,
    ResetHandler,
    { provide: ENVIRONMENT_INITIALIZER, useFactory: noop, deps: [ResetHandler], multi: true },
    withNgxsPlugin(NgxsResetPlugin),
  ]);
}
