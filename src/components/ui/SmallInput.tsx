import {Input} from "@nextui-org/react";

export default function SmallInput() {
  return (
    <div className="w-full flex flex-row flex-wrap gap-4">
        <Input
          radius={"sm"}
          type="email"
          label="Email"
          placeholder="Enter your email"
          defaultValue="junior@nextui.org"
          className="max-w-[220px]"
        />
    </div>
  );
}