import { RenderFieldExtensionCtx } from 'datocms-plugin-sdk';
import { Canvas, SelectField } from 'datocms-react-ui';
import { useMemo } from 'react';
import { data } from '../data/data';

interface Props {
  ctx: RenderFieldExtensionCtx;
}

interface ListItem {
  value: string;
  label: string;
}

interface Value {
  continent: string;
  countries: string[];
}

function isValidJson(value: any): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function serialize(value: Value, fieldType: 'json' | 'string'): string {
  if (fieldType === 'json') {
    return JSON.stringify(value.map((o) => o.text));
  }

  return value.map((o) => o.text).join(', ');
}

function deserialize(value: any, fieldType: 'json' | 'string'): Value {}

export default function GeographicArea({ ctx }: Props) {
  const value = ctx.formValues[ctx.fieldPath] as Value | null;

  const continentList = useMemo<ListItem[]>(
    () =>
      data.continents.map((x) => ({
        value: x.key,
        label: x.label,
      })),
    [],
  );

  const countries = useMemo<ListItem[]>(() => {
    const continent = data.continents.find((x) => x.key === value?.continent);

    if (continent) {
      return continent.countries.map((x) => ({
        value: x.key,
        label: x.label,
      }));
    }
    return [];
  }, [value]);

  try {
    tags = deserialize(value, fieldType);
  } catch (e) {
    tags = undefined;
  }

  return (
    <Canvas ctx={ctx}>
      <SelectField
        name="continentfieldPath"
        id="continentfieldPath"
        label="Continent"
        value={value?.continent}
        selectInputProps={{
          options: continentList,
        }}
        onChange={(newValue) => ctx.setFieldValue(ctx.fieldPath, newValue)}
      />

      <SelectField
        name="countriesfieldPath"
        id="countriesfieldPath"
        label="Country"
        hint={!value ? 'Select a continent first' : undefined}
        value={value?.countries}
        selectInputProps={{
          isDisabled: !value || !value.continent,
          options: countries,
        }}
        onChange={(newValue) => ctx.setFieldValue(ctx.fieldPath, newValue)}
      />
    </Canvas>
  );
}
