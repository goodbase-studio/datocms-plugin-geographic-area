# DatoCMS Plugin Geographic Area

![Cover](https://github.com/goodbase-studio/datocms-plugin-geographic-area/blob/4fbeea4ca7e2e9957452387873aba9b40a97c239/docs/cover-1200x800.png)

This DatoCMS plugin includes a FieldExtension applicable to a JSON field: it will display 2 fields for selecting a continent and one or more countries of the selected continent.

## Instructions

After installing the plugin, you'll need to add a new JSON field type to a block or model, go to the Presentation tab, and select "Geographic Area" for the Field editor.

## Usage

The data structure will be a stringified JSON object with the following structure:

```json
{
  "continent": "north-america",
  "countries": ["canada", "cuba"]
}
```

<br/>
<hr/>
<a href="https://goodbase.studio/" target="_blank" style="color: var(--fgColor-default);">
    <img src="./docs/logo.svg" alt="Goodbase Studio" width="159" height="32">
</a>
