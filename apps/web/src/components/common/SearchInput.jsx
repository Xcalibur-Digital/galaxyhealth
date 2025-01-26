import React from 'react';
import { TextInput, ActionIcon } from '@mantine/core';
import { IconSearch, IconX } from '@tabler/icons-react';
import { useDebounce } from '../../hooks';

const SearchInput = ({ value, onChange, placeholder = 'Search...', delay = 300 }) => {
  const debouncedValue = useDebounce(value, delay);

  return (
    <TextInput
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      icon={<IconSearch size={16} />}
      rightSection={
        value && (
          <ActionIcon onClick={() => onChange('')}>
            <IconX size={16} />
          </ActionIcon>
        )
      }
      styles={{
        rightSection: { pointerEvents: 'auto' }
      }}
    />
  );
};

export default SearchInput; 