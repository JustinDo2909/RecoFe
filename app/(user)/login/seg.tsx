type CustomInputProps = {
  fields: string[];
  onSubmit: (data: Record<string, string>) => void;
  title: string;
  typeSubmit: string;
  formData: Record<string, string>;
  onInputChange: (field: string, value: string) => void;
  renderInput: (
    field: string,
    formData: Record<string, string>,
    onInputChange: (field: string, value: string) => void,
  ) => JSX.Element;
};

const CustomInput2: React.FC<CustomInputProps> = ({
  fields,
  onSubmit,
  title,
  typeSubmit,
  formData,
  onInputChange,
  renderInput,
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        {title}
      </h2>
      {fields.map((field) => (
        <div key={field}>{renderInput(field, formData, onInputChange)}</div>
      ))}
      <button
        type="submit"
        className="w-full p-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
      >
        {typeSubmit}
      </button>
    </form>
  );
};

export default CustomInput2;
