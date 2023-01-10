import { Control, Controller } from 'react-hook-form';
import { useState, useEffect } from 'react';

import { FileInput } from '@/common/components/FileInput';

import { CreateNftDropFormFieldTypes } from '../CreateNftDropForm';

interface Props {
  control: Control<CreateNftDropFormFieldTypes, any>;
}

const FIELD_NAME = 'artwork';

export const ArtworkInput = ({ control }: Props) => {
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState<string>();

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile[0]);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }

    setSelectedFile(e.target.files);
  };

  return (
    <Controller
      control={control}
      name={FIELD_NAME}
      render={(
        { field: { onChange, value, ...props }, fieldState: { error } }, //value is unused to prevent `onChange` from updating it
      ) => (
        <FileInput
          errorMessage={error?.message}
          label="Artwork"
          preview={preview}
          selectedFile={selectedFile}
          onChange={(e) => {
            onSelectFile(e);
            onChange(e.target.files);
          }}
          {...props}
        />
      )}
    />
  );
};
