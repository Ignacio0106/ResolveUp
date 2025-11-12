import React from "react";
import PropTypes from "prop-types";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

export function CustomSelect({ field, data, label, getOptionLabel, getOptionValue, error }) {
    if (!data || data.length === 0) {
        return <div className="w-full">No hay datos</div>;
    }
    return (
        <div className="w-full">
            <Select
                onValueChange={(value) => field.onChange(value)}
                value={String(field.value ?? "")}
               
            >
                <SelectTrigger  className={cn(
                                            "w-full justify-between rounded-xl border border-gray-300 shadow-sm text-base",
                                            "placeholder:text-gray-400 bg-transparent hover:bg-transparent active:bg-transparent focus:bg-transparent",
                                            error && "border-red-500 focus:border-red-500 focus:ring-red-300")}>
                    <SelectValue placeholder={`Seleccione ${label}`} />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>{label}</SelectLabel>
                        {data?.map((item) => (
                            <SelectItem key={getOptionValue(item)} value={String(getOptionValue(item))}>
                                {getOptionLabel(item)}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
            {error && (
                <p className="flex items-center gap-1 mt-1 text-sm text-red-500">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                </p>
            )}
        </div>
    );
}

CustomSelect.propTypes = {
    field: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
    label: PropTypes.string.isRequired,
    multiple: PropTypes.bool,
    getOptionLabel: PropTypes.func.isRequired,
    getOptionValue: PropTypes.func.isRequired,
    error: PropTypes.string,
};
