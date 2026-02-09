import { RenderFieldExtensionCtx } from 'datocms-plugin-sdk';
import { Canvas, SelectField, FieldGroup, SwitchField } from 'datocms-react-ui';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { data } from '../data/data';

interface Props {
  ctx: RenderFieldExtensionCtx;
}

interface SelectOption {
  value: string;
  label: string;
}

interface Value {
  continent: string | null;
  countries: string[];
}

function parseValue(raw: unknown): Value | null {
  if (!raw || typeof raw !== 'string') return null;

  try {
    const parsed = JSON.parse(raw) as Value;
    if ((typeof parsed.continent === 'string' || parsed.continent === null) && Array.isArray(parsed.countries)) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export default function GeographicArea({ ctx }: Props) {
  const value = parseValue(ctx.formValues[ctx.fieldPath]);
  const [showOnlyCountries, setShowOnlyCountries] = useState(false);

  useEffect(() => {
    if (showOnlyCountries && value?.continent) {
      ctx.setFieldValue(
        ctx.fieldPath,
        JSON.stringify({
          continent: null,
          countries: value.countries,
        }),
      );
    }
  }, [showOnlyCountries, ctx, ctx.fieldPath, value?.continent, value?.countries]);

  const continentOptions = useMemo<SelectOption[]>(
    () =>
      data.continents.map((x) => ({
        value: x.key,
        label: x.label,
      })),
    [],
  );

  const countryOptions = useMemo<SelectOption[]>(() => {
    if (showOnlyCountries) {
      const allCountries = data.continents.flatMap((continent) => continent.countries);
      return allCountries
        .map((x) => ({
          value: x.key,
          label: x.label,
        }))
        .sort((a, b) => a.label.localeCompare(b.label));
    }

    const continent = data.continents.find((x) => x.key === value?.continent);
    if (!continent) return [];
    return continent.countries.map((x) => ({
      value: x.key,
      label: x.label,
    }));
  }, [value?.continent, showOnlyCountries]);

  const selectedContinent = useMemo(
    () => continentOptions.find((o) => o.value === value?.continent) ?? null,
    [continentOptions, value?.continent],
  );

  const selectedCountries = useMemo(
    () => countryOptions.filter((o) => value?.countries?.includes(o.value)),
    [countryOptions, value?.countries],
  );

  const handleContinentChange = useCallback(
    (newValue: SelectOption | readonly SelectOption[] | null) => {
      const selected = Array.isArray(newValue) ? newValue[0] : newValue;
      ctx.setFieldValue(
        ctx.fieldPath,
        JSON.stringify({
          continent: selected?.value ?? null,
          countries: [],
        }),
      );
    },
    [ctx],
  );

  const handleCountriesChange = useCallback(
    (newValue: SelectOption | readonly SelectOption[] | null) => {
      const selected = Array.isArray(newValue) ? newValue : newValue ? [newValue] : [];
      ctx.setFieldValue(
        ctx.fieldPath,
        JSON.stringify({
          continent: value?.continent ?? null,
          countries: selected.map((o) => o.value),
        }),
      );
    },
    [ctx, value?.continent],
  );

  return (
    <Canvas ctx={ctx}>
      <FieldGroup>
        <SwitchField
          name="showOnlyCountries"
          id="showOnlyCountries"
          label="Display only the countries selector"
          value={showOnlyCountries}
          onChange={(newValue) => setShowOnlyCountries(newValue)}
        />

        {!showOnlyCountries && (
          <SelectField
            name="continent"
            id="continent"
            label="Continent"
            value={selectedContinent}
            selectInputProps={{
              options: continentOptions,
              isClearable: true,
            }}
            onChange={handleContinentChange}
          />
        )}

        <SelectField
          name="countries"
          id="countries"
          label="Countries"
          hint={!showOnlyCountries && !value?.continent ? 'Select a continent first' : undefined}
          value={selectedCountries}
          selectInputProps={{
            isMulti: true,
            isDisabled: !showOnlyCountries && !value?.continent,
            options: countryOptions,
          }}
          onChange={handleCountriesChange}
        />
      </FieldGroup>
    </Canvas>
  );
}
