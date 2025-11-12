import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Check, ChevronsUpDown, X, AlertCircle } from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CustomMultiSelect({ field, data, label, getOptionLabel, getOptionValue, error }) {
    const [open, setOpen] = useState(false);
    const [selectedValues, setSelectedValues] = useState(field.value || []);

    const toggleValue = (value) => {
        const newValues = selectedValues.includes(value)
            ? selectedValues.filter((v) => v !== value)
            : [...selectedValues, value];

        setSelectedValues(newValues);
        field.onChange(newValues);
    };

    const removeValue = (value) => {
        const newValues = selectedValues.filter((v) => v !== value);
        setSelectedValues(newValues);
        field.onChange(newValues);
    };

    useEffect(() => {
        if (JSON.stringify(field.value) !== JSON.stringify(selectedValues)) {
            setSelectedValues(field.value || []);
        }
    }, [field.value, selectedValues]);

    const selectedItems = data?.filter((item) =>
        selectedValues.includes(String(getOptionValue(item)))
    );

    return (
        <div className="w-full">
            <label className="block mb-1 text-sm font-medium">{label}</label>

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        role="combobox"
                        aria-expanded={open}
                        className={cn(
            "w-full justify-between rounded-xl border shadow-sm text-base transition-all duration-200 placeholder:text-gray-400",
            "bg-transparent hover:bg-transparent active:bg-transparent focus:bg-transparent text-gray-400",
            error ? "border-red-500" : "border-gray-300 focus:border-primary"
        )}
                    >
                        {selectedItems?.length > 0
                            ? `${selectedItems.length} seleccionado(s)`
                            : `Seleccionar ${label}`}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="w-[300px] p-0">
                    <Command>
                        <CommandInput  placeholder={`Buscar ${label}...`} />
                        <CommandEmpty>No se encontraron resultados.</CommandEmpty>
                        <CommandGroup>
                            {data?.map((item) => {
                                const value = String(getOptionValue(item));
                                return (
                                    <CommandItem key={value} onSelect={() => toggleValue(value)}>
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                selectedValues.includes(value) ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {getOptionLabel(item)}
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    </Command>
                </PopoverContent>
            </Popover>

            {/* Chips debajo del select */}
            <div className="mt-2 flex flex-wrap gap-2">
                {selectedItems?.map((item) => {
                    const value = String(getOptionValue(item));
                    return (
                        <span
                            key={value}
                            className="flex items-center bg-secondary text-white text-sm px-2 py-1 rounded-full gap-1"
                        >
                            {getOptionLabel(item)}
                            <X className="w-3 h-3 cursor-pointer" onClick={() => removeValue(value)} />
                        </span>
                    );
                })}
            </div>

            {/* Mensaje de error */}
            {error && (
                <p className="flex items-center gap-1 mt-1 text-sm text-red-500">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                </p>
            )}
        </div>
    );
}

CustomMultiSelect.propTypes = {
    field: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
    label: PropTypes.string.isRequired,
    getOptionLabel: PropTypes.func.isRequired,
    getOptionValue: PropTypes.func.isRequired,
    error: PropTypes.string,
};
