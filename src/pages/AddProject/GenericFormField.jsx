import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import React from "react";

const GenericFormField = ({ name, control, label, children }) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-lg">{label}</FormLabel>
          <FormControl>{children(field)}</FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default GenericFormField;
