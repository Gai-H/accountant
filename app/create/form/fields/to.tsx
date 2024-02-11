import { ChangeEvent, useEffect, useState } from "react"
import { CheckedState } from "@radix-ui/react-checkbox"
import { Trash2 } from "lucide-react"
import { ControllerRenderProps, UseFormReturn, useController, useWatch } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UsersGetResponse } from "@/types/firebase"
import FormLabel from "../form-label"
import { schema } from "../schema"

type UseSplit = {
  split: boolean
  setSplit: (newSplit: boolean) => void
}

const useSplit = (): UseSplit => {
  const fromFieldValue = useWatch<z.infer<typeof schema>, "from">({ name: "from" })
  const { field: toField } = useController<z.infer<typeof schema>, "to">({ name: "to" })
  const [split, setSplit] = useState<boolean>(true)

  const splitAmount =
    fromFieldValue.some((f) => f.amount === Number.MIN_SAFE_INTEGER) || fromFieldValue.length === 0
      ? Number.MIN_SAFE_INTEGER
      : fromFieldValue.reduce((p, c) => p + c.amount, 0) / toField.value.length

  useEffect(() => {
    if (split) {
      toField.onChange(toField.value.map((f) => ({ ...f, amount: splitAmount })))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [split, splitAmount])

  return { split, setSplit }
}

type ToFormFieldProps = UseFormReturn<z.infer<typeof schema>> & {
  users: UsersGetResponse
}

function ToFormField({ control, users }: ToFormFieldProps) {
  const { split, setSplit } = useSplit()

  return (
    <FormField
      control={control}
      name="to"
      render={({ field }) => (
        <FormItem>
          {/* <p>{JSON.stringify(field.value)}</p> */}
          <div className="flex items-center gap-2">
            <FormLabel>借りる人</FormLabel>
            <FormMessage />
          </div>
          <SplitCheckbox
            split={split}
            setSplit={setSplit}
          />
          {field.value.map((_, index) => (
            <Item
              key={index}
              field={field}
              users={users}
              index={index}
              split={split}
            />
          ))}
          <div className="flex gap-2">
            <AddItemButton
              field={field}
              users={users}
            />
            <AddEveryoneButton
              field={field}
              users={users}
            />
          </div>
        </FormItem>
      )}
    />
  )
}

export { ToFormField }

type Field = ControllerRenderProps<z.infer<typeof schema>, "to">

type AddItemButtonProps = {
  field: Field
  users: UsersGetResponse
}

function AddItemButton({ field, users }: AddItemButtonProps) {
  const disabled = field.value?.length === Object.keys(users).length

  const handleClick = () => {
    const updated = [...field.value, { id: "", amount: Number.MIN_SAFE_INTEGER }]
    field.onChange(updated)
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

type AddEveryoneButtonProps = {
  field: Field
  users: UsersGetResponse
}

function AddEveryoneButton({ field, users }: AddEveryoneButtonProps) {
  const disabled = field.value?.length === Object.keys(users).length && field.value.every((item) => item.id !== "")

  const handleClick = () => {
    const updated = Object.keys(users).map((id) => ({ id, amount: Number.MIN_SAFE_INTEGER }))
    field.onChange(updated)
  }

  return (
    <Button
      variant="secondary"
      type="button"
      disabled={disabled}
      onClick={handleClick}
      className="block w-32"
    >
      全員を追加
    </Button>
  )
}

type SplitCheckboxProps = {
  split: boolean
  setSplit: (newSplit: boolean) => void
}

function SplitCheckbox({ split, setSplit }: SplitCheckboxProps) {
  const handleCheckedChange = (checked: CheckedState) => {
    const newChecked = checked === "indeterminate" ? true : checked
    setSplit(newChecked)
  }

  return (
    <div className="flex w-32 items-center gap-2 rounded-md border px-3 justify-around h-10">
      <Checkbox
        id="to-checkbox-split"
        checked={split}
        onCheckedChange={handleCheckedChange}
      />
      <label
        htmlFor="to-checkbox-split"
        className="cursor-pointer text-sm font-medium leading-none"
      >
        割り勘する
      </label>
    </div>
  )
}

type ItemProps = {
  field: Field
  users: UsersGetResponse
  index: number
  split: boolean
}

function Item({ field, users, index, split }: ItemProps) {
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
        split={split}
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
      <SelectTrigger className="w-24 flex-grow md:flex-grow-0">
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
  split: boolean
}

function AmountInput({ field, index, split }: AmountInputProps) {
  const value = field.value[index].amount === Number.MIN_SAFE_INTEGER ? "" : field.value[index].amount

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (split) return
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
      disabled={split}
    />
  )
}

type RemoveItemProps = {
  field: Field
  index: number
}

function RemoveItemButton({ field, index }: RemoveItemProps) {
  const disabled = field.value.length === 1

  const handleClick = () => {
    const removed = field.value.filter((_, i) => i !== index)
    field.onChange(removed)
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
