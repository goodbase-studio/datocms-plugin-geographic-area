import { Canvas, SelectField } from "datocms-react-ui";

export default function ChildField({ ctx }: Props) {
  const parentValue = ctx.formValues.parent_field as string | null;
  const childValue = ctx.formValues.child_field as string | null;

  const availableOptions = parentValue ? OPTIONS_MAP[parentValue] : [];

  return (
    <Canvas ctx={ctx}>
      <SelectField
        name={ctx.fieldPath}
        id={ctx.fieldPath}
        label="Child"
        hint={!parentValue ? "Select a parent first" : undefined}
        value={childValue || ""}
        selectInputProps={{
          isDisabled: !parentValue,
          options: availableOptions.map((opt) => ({ label: opt, value: opt })),
        }}
        onChange={(newValue) => ctx.setFieldValue(ctx.fieldPath, newValue)}
      />
    </Canvas>
  );
}
