import { useFieldArray, useFormContext } from 'react-hook-form'
import { TextArea, TextInput, Button, Badge } from './ui'
import type { Quiz } from './types'

type QuestionEditorProps = {
  index: number
  onRemove: () => void
}

export function QuestionEditor({ index, onRemove }: QuestionEditorProps) {
  const {
    register,
    control,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<Quiz>()

  const { fields, append, remove } = useFieldArray({
    control,
    name: `questions.${index}.options`,
  })

  // Register these fields for validation
  register(`questions.${index}.options`, {
    validate: (v) => v.length >= 2 || 'Mỗi câu hỏi cần ít nhất 2 lựa chọn.',
  })
  register(`questions.${index}.correctOptionValues`, {
    validate: (v) => v.length >= 1 || 'Mỗi câu hỏi cần ít nhất một đáp án đúng.',
  })

  const questionErrors = errors.questions?.[index]
  const correctOptionValues = watch(`questions.${index}.correctOptionValues`) || []

  const toggleCorrect = (optionValue: string) => {
    const next = correctOptionValues.includes(optionValue)
      ? correctOptionValues.filter((v) => v !== optionValue)
      : [...correctOptionValues, optionValue]
    setValue(`questions.${index}.correctOptionValues`, next, {
      shouldDirty: true,
      shouldValidate: true,
    })
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <header className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Badge>Câu hỏi {index + 1}</Badge>
        </div>
        <Button variant="danger" type="button" onClick={onRemove}>
          Xóa câu hỏi
        </Button>
      </header>

      <div className="mb-4 grid gap-4 md:grid-cols-[minmax(0,3fr)_minmax(0,1fr)]">
        <TextInput
          label="Tên câu hỏi"
          required
          placeholder="VD: Câu hỏi 1"
          {...register(`questions.${index}.name`, {
            required: 'Tên câu hỏi là bắt buộc.',
          })}
          error={questionErrors?.name?.message}
        />
        <TextInput
          label="Thứ tự câu hỏi"
          type="number"
          min={1}
          className="w-full"
          {...register(`questions.${index}.sortOrder`, {
            valueAsNumber: true,
          })}
        />
      </div>

      <div className="mb-4">
        <TextArea
          label="Mô tả câu hỏi"
          required
          placeholder="Nhập nội dung câu hỏi..."
          {...register(`questions.${index}.description`, {
            required: 'Mô tả câu hỏi là bắt buộc.',
          })}
          error={questionErrors?.description?.message}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-800">
            Lựa chọn trả lời
          </h3>
          <Button
            type="button"
            variant="ghost"
            onClick={() =>
              append({
                id: crypto.randomUUID(),
                value: `option_${fields.length + 1}`,
                label: '',
                sortOrder: fields.length + 1,
              })
            }
          >
            + Thêm lựa chọn
          </Button>
        </div>

        <div className="space-y-3">
          {questionErrors?.options?.message && (
            <p className="text-xs text-rose-500">
              {questionErrors.options.message}
            </p>
          )}
          {fields.map((option, optionIndex) => {
            const isCorrect = correctOptionValues.includes(
              watch(`questions.${index}.options.${optionIndex}.value`),
            )
            const optionErrors = questionErrors?.options?.[optionIndex]

            return (
              <div
                key={option.id}
                className="rounded-xl border border-slate-200 bg-slate-50 p-3.5"
              >
                <div className="flex flex-col gap-3 md:grid md:grid-cols-[auto_minmax(0,1.3fr)_minmax(0,1.8fr)_auto_auto] md:items-end md:gap-3">
                  <span className="text-xs font-medium text-slate-500 md:order-1">
                    #{optionIndex + 1}
                  </span>

                  <TextInput
                    label="Giá trị"
                    required
                    className="md:order-2"
                    {...register(`questions.${index}.options.${optionIndex}.value`, {
                      required: 'Giá trị là bắt buộc.',
                    })}
                    error={optionErrors?.value?.message}
                  />

                  <TextInput
                    label="Nhãn hiển thị"
                    required
                    className="md:order-3"
                    {...register(`questions.${index}.options.${optionIndex}.label`, {
                      required: 'Nhãn là bắt buộc.',
                    })}
                    error={optionErrors?.label?.message}
                  />

                  <TextInput
                    label="Thứ tự"
                    type="number"
                    min={1}
                    className="w-28 md:w-full md:order-4"
                    {...register(
                      `questions.${index}.options.${optionIndex}.sortOrder`,
                      { valueAsNumber: true },
                    )}
                  />

                  <div className="flex items-center justify-end gap-2 md:flex-col md:items-end md:order-5">
                    <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                        checked={isCorrect}
                        onChange={() =>
                          toggleCorrect(
                            watch(`questions.${index}.options.${optionIndex}.value`),
                          )
                        }
                      />
                      Đúng
                    </label>
                    <Button
                      variant="ghost"
                      type="button"
                      className="text-xs text-red-600"
                      onClick={() => {
                        const val = watch(
                          `questions.${index}.options.${optionIndex}.value`,
                        )
                        remove(optionIndex)
                        setValue(
                          `questions.${index}.correctOptionValues`,
                          correctOptionValues.filter((v) => v !== val),
                        )
                      }}
                      disabled={fields.length <= 2}
                    >
                      Xóa lựa chọn
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
          {questionErrors?.correctOptionValues?.message && (
            <p className="text-xs text-rose-500">
              {questionErrors.correctOptionValues.message}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
