import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddRess {
  name: string;
  codeId: string;
}

interface SelectProps {
  lists: AddRess[];
  title: string;
  onSelect?: (value: string) => void;
}

export function SelectFiled({ lists, title, onSelect }: SelectProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const filteredLists = lists.filter((list) =>
    list.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Select onValueChange={onSelect}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={`Select a ${title}`} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{title}</SelectLabel>
          <div className="p-2">
            <input
              type="text"
              className="w-full border p-2 mb-2"
              placeholder={`Search ${title}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {Array.isArray(filteredLists) && filteredLists.length > 0 ? (
            filteredLists.map((list) => (
              <SelectItem key={list.codeId} value={list.codeId}>
                {list.name}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="no" disabled>
              No results found
            </SelectItem>
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
