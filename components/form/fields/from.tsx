import { ChangeEvent } from "react"
import { Trash2 } from "lucide-react"
import { ControllerRenderProps, UseFormReturn } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UsersGetResponse } from "@/types/firebase"
import FormLabel from "../form-label"
import { schema } from "../schema"

type FromFormFieldProps = UseFormReturn<z.infer<typeof schema>> & {
  users: UsersGetResponse
}

function FromFormField({ control, users }: FromFormFieldProps) {
  return (
    <FormField
      control={control}
      name="from"
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center gap-2">
            <FormLabel>貸す人</FormLabel>
            <FormMessage />
          </div>
          {field.value.map((_, index) => (
            <Item
              key={index}
              field={field}
              users={users}
              index={index}
            />
          ))}
          <AddItemButton
            field={field}
            users={users}
          />
        </FormItem>
      )}
    />
  )
}

export { FromFormField }

type Field = ControllerRenderProps<z.infer<typeof schema>, "from">

type AddItemButtonProps = {
  field: Field
  users: UsersGetResponse
}

function AddItemButton({ field, users }: AddItemButtonProps) {
  const disabled = field.value?.length === Object.keys(users).length

  const handleClick = () => {
    field.onChange([...field.value, { id: "", amount: Number.MIN_SAFE_INTEGER }])
  }

  return (
    <Button
      variant="secondary"
      type="button"
      disabled={disabled}
      onClick={handleClick}
      className="block w-32"
    >
      一人を追加
    </Button>
  )
}

type ItemProps = {
  field: Field
  users: UsersGetResponse
  index: number
}

function Item({ field, users, index }: ItemProps) {
  return (
    <div className="flex gap-2">
      <UserSelect
        field={field}
        users={users}
        index={index}
      />
      <AmountInput
        field={field}
        index={index}
      />
      <RemoveItemButton
        field={field}
        index={index}
      />
    </div>
  )
}

type UserSelectProps = {
  field: Field
  users: UsersGetResponse
  index: number
}

function UserSelect({ field, users, index }: UserSelectProps) {
  const value = field.value[index].id

  const handleValueChange = (newValue: string) => {
    const newFieldValue = [...field.value]
    newFieldValue[index].id = newValue
    field.onChange(newFieldValue)
  }

  return (
    <Select
      onValueChange={handleValueChange}
      value={value}
    >
      <SelectTrigger className="w-32 flex-grow md:flex-grow-0">
        <SelectValue placeholder="人" />
      </SelectTrigger>
      <SelectContent>
        {Object.keys(users).map((id) => (
          <SelectItem
            key={id}
            value={id}
            disabled={field.value.some((item) => item.id === id)}
          >
            {users[id].displayName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

type AmountInputProps = {
  field: Field
  index: number
}

function AmountInput({ field, index }: AmountInputProps) {
  const value = field.value[index].amount === Number.MIN_SAFE_INTEGER ? "" : field.value[index].amount

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newFieldValue = [...field.value]
    newFieldValue[index].amount = e.target.value.length === 0 ? Number.MIN_SAFE_INTEGER : Number(e.target.value)
    field.onChange(newFieldValue)
  }

  return (
    <Input
      type="number"
      value={value}
      placeholder="金額"
      className="w-32"
      onChange={handleChange}
    />
  )
}

type RemoveItemButtonProps = {
  field: Field
  index: number
}

function RemoveItemButton({ field, index }: RemoveItemButtonProps) {
  const disabled = field.value.length === 1

  const handleClick = () => {
    field.onChange(field.value.filter((_, i) => i !== index))
  }

  return (
    <Button
      size="icon"
      variant="destructive"
      type="button"
      onClick={handleClick}
      disabled={disabled}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  )
}
