
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Chef } from "@/lib/mock-data"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  title: z.enum(['Head Chef', 'Sous Chef', 'Pastry Chef', 'Chef de Partie']),
  bio: z.string().min(10, "Bio must be at least 10 characters."),
  imageUrl: z.string().url("Please enter a valid image URL."),
})

type ChefFormValues = z.infer<typeof formSchema>

interface ChefFormProps {
  initialData?: Chef | null
  onSubmit: (data: ChefFormValues) => void
  onCancel: () => void
}

export function ChefForm({ initialData, onSubmit, onCancel }: ChefFormProps) {
  const form = useForm<ChefFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || { name: "", title: "Chef de Partie", bio: "", imageUrl: "" },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Tunde Wey" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a title" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Head Chef">Head Chef</SelectItem>
                  <SelectItem value="Sous Chef">Sous Chef</SelectItem>
                  <SelectItem value="Pastry Chef">Pastry Chef</SelectItem>
                  <SelectItem value="Chef de Partie">Chef de Partie</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea placeholder="Tell us a little bit about this chef" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://placehold.co/400x500.png" {...field} />
              </FormControl>
              <FormDescription>
                Provide a URL for the chef's portrait.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  )
}
