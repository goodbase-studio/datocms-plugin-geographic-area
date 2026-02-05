import { connect, ManualFieldExtensionsCtx } from 'datocms-plugin-sdk';
import 'datocms-react-ui/styles.css';
import ConfigScreen from './entrypoints/ConfigScreen';
import { render } from './utils/render';
import GeographicArea from './components/GeographicArea';

connect({
  // First we register the field extension with the plugin SDK
  // @ts-ignore
  manualFieldExtensions(ctx: ManualFieldExtensionsCtx) {
    return [
      {
        id: 'geographicArea',
        name: 'Geographic Area',
        type: 'editor',
        fieldTypes: ['json'],
        configurable: false,
      },
    ];
  },

  // Then we tell it how to render it
  renderFieldExtension(fieldExtensionId, ctx) {
    if (fieldExtensionId === 'geographicArea') {
      return render(<GeographicArea ctx={ctx} />); // <-- Main component is here!
    }
  },

  renderConfigScreen(ctx) {
    return render(<ConfigScreen ctx={ctx} />);
  },
});
