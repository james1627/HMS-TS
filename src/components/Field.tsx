type FieldProps = {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  defaultValue?: string;
  minLength?: number;
};

export default function Field({
  label,
  name,
  type = 'text',
  placeholder,
  defaultValue,
  minLength,
}: FieldProps) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        required={label.endsWith('*')}
        name={name}
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        minLength={minLength}
      />
    </label>
  );
}
