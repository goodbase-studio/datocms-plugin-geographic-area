import { Canvas, SelectField } from "datocms-react-ui";

export default function ParentField({ ctx }: Props) {
  const value =
    ctx.fieldPath === "parent_field"
      ? (ctx.formValues.parent_field as string)
      : "";

  return (
    <Canvas ctx={ctx}>
      <SelectField
        name={ctx.fieldPath}
        id={ctx.fieldPath}
        label="Parent"
        value={value || ""}
        selectInputProps={{
          options: PARENT_OPTIONS.map((opt) => ({ label: opt, value: opt })),
        }}
        onChange={(newValue) => ctx.setFieldValue(ctx.fieldPath, newValue)}
      />
    </Canvas>
  );
}
