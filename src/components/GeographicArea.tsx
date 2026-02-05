import { RenderFieldExtensionCtx } from 'datocms-plugin-sdk';
import { Canvas, SelectField } from 'datocms-react-ui';
import { useCallback, useMemo } from 'react';
import { data } from '../data/data';

interface Props {
  ctx: RenderFieldExtensionCtx;
}

interface SelectOption {
  value: string;
  label: string;
}

interface Value {
  continent: string;
  countries: string[];
}

export default function GeographicArea({ ctx }: Props) {
  //   const value = ctx.formValues[ctx.fieldPath] as Value | null;
  const rawValue = ctx.formValues[ctx.fieldPath] as string | null;
  const value: Value | null = rawValue ? JSON.parse(rawValue) : null;

  const continentOptions = useMemo<SelectOption[]>(
    () =>
      data.continents.map((x) => ({
        value: x.key,
        label: x.label,
      })),
    [],
  );

  const countryOptions = useMemo<SelectOption[]>(() => {
    const continent = data.continents.find((x) => x.key === value?.continent);
    if (!continent) return [];
    return continent.countries.map((x) => ({
      value: x.key,
      label: x.label,
    }));
  }, [value?.continent]);

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
          continent: selected?.value ?? '',
          countries: [],
        }),
      );
    },
    [ctx],
  );

  const handleCountriesChange = useCallback(
    (newValue: readonly SelectOption[] | null) => {
      ctx.setFieldValue(
        ctx.fieldPath,
        JSON.stringify({
          continent: value?.continent ?? '',
          countries: newValue?.map((o) => o.value) ?? [],
        }),
      );
    },
    [ctx, value?.continent],
  );

  return (
    <Canvas ctx={ctx}>
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

      <SelectField
        name="countries"
        id="countries"
        label="Countries"
        hint={!value?.continent ? 'Select a continent first' : undefined}
        value={selectedCountries}
        selectInputProps={{
          isMulti: true,
          isDisabled: !value?.continent,
          options: countryOptions,
        }}
        onChange={handleCountriesChange}
      />
    </Canvas>
  );
}
