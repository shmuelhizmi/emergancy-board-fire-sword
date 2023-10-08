import {
  Checkbox,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  Text,
  Textarea,
} from "@chakra-ui/react";

export type RequestedField = {
  type: keyof typeof fieldTypes;
  id: string;
  title: string;
  description: string;
  required: boolean;
};

export const fieldTypes = {
  text: {
    renderData: (field: RequestedField, data: string) => {
      const isUrl = data.startsWith("http");
      return (
        <Text fontSize={"small"}>
          {field.title}: {isUrl ? <a href={data}>{data}</a> : data}
        </Text>
      );
    },
    renderInput: (
      field: RequestedField,
      data: string,
      onChange: (data: string) => void
    ) => {
      return (
        <FormControl id={field.id}>
          <FormLabel>{field.title}</FormLabel>
          <Input
            type="text"
            value={data}
            onChange={(e) => onChange(e.target.value)}
          />
        </FormControl>
      );
    },
  },
  textarea: {
    renderData: (field: RequestedField, data: string) => {
      return (
        <Text fontSize={"small"}>
          {field.title}: {data}
        </Text>
      );
    },
    renderInput: (
      field: RequestedField,
      data: string,
      onChange: (data: string) => void
    ) => {
      return (
        <FormControl id={field.id}>
          <FormLabel>{field.title}</FormLabel>
          <Textarea value={data} onChange={(e) => onChange(e.target.value)} />
        </FormControl>
      );
    },
  },
  checkbox: {
    renderData: (field: RequestedField, data: string) => {
      return (
        <Text fontSize={"small"}>
          {field.title}: {data}
        </Text>
      );
    },
    renderInput: (
      field: RequestedField,
      data: string,
      onChange: (data: string) => void
    ) => {
      return (
        <FormControl id={field.id}>
          <FormLabel>{field.title}</FormLabel>
          <Checkbox
            isChecked={data === "true"}
            onChange={(e) => onChange(e.target.checked.toString())}
          />
        </FormControl>
      );
    },
  },
  phone: {
    renderData: (field: RequestedField, data: string) => {
      return (
        <Text fontSize={"small"}>
          {field.title}: {data}
        </Text>
      );
    },
    renderInput: (
      field: RequestedField,
      data: string,
      onChange: (data: string) => void
    ) => {
      return (
        <FormControl id={field.id}>
          <FormLabel>{field.title}</FormLabel>
          <InputGroup>
            <Input
              type="tel"
              value={data || '05'}
              onChange={(e) => onChange(e.target.value)}
            />
          </InputGroup>
        </FormControl>
      );
    },
  },
};
