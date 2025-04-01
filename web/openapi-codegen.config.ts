import {
  generateSchemaTypes,
  generateReactQueryComponents,
  forceReactQueryComponent,
} from '@openapi-codegen/typescript';
import { defineConfig } from '@openapi-codegen/cli';
export default defineConfig({
  yuppie: {
    from: {
      source: 'url',
      url: 'https://dev2.yuppie.business/openapi.json',
    },
    outputDir: 'src/api',
    to: async (context) => {
      const filenamePrefix = 'yuppie';
      const { schemasFiles } = await generateSchemaTypes(context, {
        filenamePrefix,
      });
      await generateReactQueryComponents(context, {
        filenamePrefix,
        schemasFiles,
      });
    },
  },
});
