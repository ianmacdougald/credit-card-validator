import * as React from 'react';
import { TextField, SxProps } from '@mui/material';

interface CardFormItemProps {
  style?: SxProps;
  label: string;
  helperText: string;
  placeholder: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  error?: boolean;
}

const CardFormItem = ({
  style,
  label,
  helperText,
  placeholder,
  onChange,
  error,
}: CardFormItemProps): React.ReactElement => (
  <TextField
    className='card-form-item'
    sx={style}
    id='outlined'
    label={label}
    variant='outlined'
    autoComplete='on'
    helperText={helperText}
    placeholder={placeholder}
    onChange={onChange}
    error={error}
  />
);

export default CardFormItem;
