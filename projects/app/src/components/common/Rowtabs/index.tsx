import React from 'react';
import { Flex, Box, BoxProps, border } from '@chakra-ui/react';
import MyIcon from '@fastgpt/web/components/common/Icon';

type Props = BoxProps & {
  list: {
    icon?: string;
    label: string | React.ReactNode;
    value: string;
  }[];
  value: string;
  onChange: (e: string) => void;
};

const RowTabs = ({ list, value, onChange, py = '7px', px = '12px', ...props }: Props) => {
  return (
    <Box
      display={'inline-flex'}
      px={'3px'}
      borderBottom={'1px'}
      borderColor={'blue.100'}
      gap={'4px'}
      {...props}
    >
      {list.map((item) => (
        <Flex
          key={item.value}
          flex={'1 0 0'}
          alignItems={'center'}
          cursor={'pointer'}
          px={px}
          py={py}
          userSelect={'none'}
          whiteSpace={'noWrap'}
          {...(value === item.value
            ? {
                bg: 'white',
                // boxShadow: '1.5',
                color: 'primary.600',
                borderBottom: '2px solid'
              }
            : {
                onClick: () => onChange(item.value)
              })}
        >
          {item.icon && <MyIcon name={item.icon as any} mr={1} w={'14px'} />}
          <Box>{item.label}</Box>
        </Flex>
      ))}
    </Box>
  );
};

export default RowTabs;
