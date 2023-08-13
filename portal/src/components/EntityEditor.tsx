import { CheckIcon, PlusIcon, TrashIcon } from '@radix-ui/react-icons'
import { useId, useState } from 'react'

type ValueType =
  | 'string'
  | 'integer'
  | 'float'
  | 'boolean'
  | 'date'
  | 'datetime'
  | 'time'
  | 'enum'
  | 'array'
  | 'reference'

interface BaseValue {
  type: ValueType
}

interface StringValue extends BaseValue {
  type: 'string'
  minLength?: number
  maxLength?: number
  kind?: 'text' | 'password' | 'email' | 'url' | 'uuid' | 'phone' | 'color' | 'name' | 'company-name'
}

interface NumberValue extends BaseValue {
  type: 'integer' | 'float'
  minimum?: number
  maximum?: number
}

interface ReferenceValue extends BaseValue {
  type: 'reference'
  entityId: string
}

type Value = StringValue | NumberValue | ReferenceValue

interface EntityProperty {
  name: string
  description?: string
  required?: boolean
  nullable?: boolean
  value: Value
}

export interface Entity {
  id: string
  name: string
  description?: string

  properties: EntityProperty[]
}

export interface EntityCreatorProps {
  entity: Entity
}

function EntityEditor(props: EntityCreatorProps) {
  const id = useId()
  const [entity, setEntity] = useState<Entity>(props.entity)

  const addProperty = (property: EntityProperty) => {
    setEntity((prev) => ({ ...prev, properties: [...prev.properties, property] }))
  }

  const removeProperty = (index: number) => {
    setEntity((prev) => ({ ...prev, properties: prev.properties.filter((_, i) => i !== index) }))
  }

  return (
    <>
      <form
        hidden
        id={'add-property-' + id}
        onSubmit={(event) => {
          event.preventDefault()
          const form = event.currentTarget
          const data = new FormData(form)
          const name = data.get('name') as string
          const description = data.get('description') as string

          const isExisting = entity.properties.some((property) => property.name === name)

          if (isExisting) {
            const name = form.elements.namedItem('name') as HTMLInputElement
            name.setCustomValidity('Property already exists')
            name.reportValidity()
            return
          }

          addProperty({ name, description, value: { type: 'string', kind: 'text' } })
          form.reset()
        }}
      />
      <form
        className='bg-slate-700 p-4 rounded-md flex flex-col gap-3'
        action={`/actions/update/${entity.name}`}
        method='POST'
      >
        <input
          required
          className='text-3xl font-bold bg-slate-200 bg-opacity-5 w-full p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-30'
          type='text'
          name='name'
          placeholder='Entity name'
          defaultValue={props.entity.name}
        />
        <textarea
          className='w-100 bg-slate-200 bg-opacity-5 w-full p-2 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-30'
          rows={4}
          placeholder='Description'
          defaultValue={props.entity.description}
        />
        <ul className='flex flex-col gap-2'>
          {entity.properties.map((property, index) => (
            <li key={index} className='flex gap-3 items-center bg-slate-200 bg-opacity-5 p-2 rounded-md'>
              <div className='flex flex-col gap-2 flex-1'>
                <input
                  type='text'
                  name={`properties.${index}.name`}
                  className='bg-slate-200 bg-opacity-5 w-full px-2 py-1 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-slate-500 text-base'
                  defaultValue={property.name}
                />

                <textarea
                  name={`properties.${index}.description`}
                  className='bg-slate-200 bg-opacity-5 w-full p-2 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-slate-500'
                  placeholder='Field description'
                  defaultValue={property.description}
                />
              </div>
              <button
                type='button'
                onClick={() => removeProperty(index)}
                className='bg-red-400 bg-opacity-75 rounded-full p-1 hover:bg-opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-opacity-30'
              >
                <TrashIcon />
              </button>
            </li>
          ))}
          <li className='flex gap-3 items-center bg-slate-200 bg-opacity-5 p-2 rounded-md'>
            <div className='flex flex-col gap-2 flex-1'>
              <input
                autoComplete='off'
                required
                form={'add-property-' + id}
                type='text'
                name='name'
                placeholder='Field name'
                className='bg-slate-200 bg-opacity-5 w-full px-2 py-1 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-slate-500'
              />
              <textarea
                form={'add-property-' + id}
                name='description'
                className='bg-slate-200 bg-opacity-5 w-full p-2 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-slate-500'
                placeholder='Field description'
              />
            </div>
            <button
              form={'add-property-' + id}
              type='submit'
              className='ml-auto bg-blue-400 bg-opacity-75 rounded-full p-1 hover:bg-opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-opacity-30'
            >
              <PlusIcon />
            </button>
          </li>
        </ul>
        <button
          type='submit'
          className='flex items-center justify-center gap-1 self-end bg-green-400 bg-opacity-75 rounded-md p-2 hover:bg-opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-opacity-30'
        >
          <CheckIcon />
          Save
        </button>
      </form>
    </>
  )
}

export default EntityEditor

function truncate(str: string, maxLength: number) {
  return str.length > maxLength ? str.slice(0, maxLength - 3) + '...' : str
}
