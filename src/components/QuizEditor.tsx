import { useState, useMemo } from 'react'
import { useForm, useFieldArray, FormProvider } from 'react-hook-form'
import type { Quiz, Question } from './types'
import { TextArea, TextInput, Button, Badge } from './ui'
import { QuestionEditor } from './QuestionEditor'

const createEmptyQuestion = (index: number): Question => ({
  id: crypto.randomUUID(),
  name: '',
  description: '',
  sortOrder: index + 1,
  options: [
    {
      id: crypto.randomUUID(),
      value: 'option_1',
      label: '',
      sortOrder: 1,
    },
    {
      id: crypto.randomUUID(),
      value: 'option_2',
      label: '',
      sortOrder: 2,
    },
  ],
  correctOptionValues: [],
})

const createEmptyQuiz = (): Quiz => ({
  name: '',
  description: '',
  questions: [createEmptyQuestion(0)],
})

type QuizEditorProps = {
  initial?: Quiz
}

export function QuizEditor({ initial }: QuizEditorProps) {
  const methods = useForm<Quiz>({
    defaultValues: initial ?? createEmptyQuiz(),
  })

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = methods

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions',
  })

  register('questions', {
    validate: (v) => v.length >= 1 || 'Quiz cần ít nhất một câu hỏi.',
  })

  const [submittedQuiz, setSubmittedQuiz] = useState<Quiz | null>(null)
  const [exportedJson, setExportedJson] = useState('')
  const [importText, setImportText] = useState('')
  const [showImport, setShowImport] = useState(false)

  const watchedQuiz = watch()
  const hasChangesSinceSubmit = useMemo(() => {
    if (!submittedQuiz) return false
    return JSON.stringify(watchedQuiz) !== JSON.stringify(submittedQuiz)
  }, [watchedQuiz, submittedQuiz])

  const onSubmit = (data: Quiz) => {
    // Basic validation for questions and options
    if (data.questions.length === 0) {
      alert('Quiz cần ít nhất một câu hỏi.')
      return
    }

    const normalized: Quiz = {
      ...data,
      name: data.name.trim(),
      description: data.description.trim(),
      questions: data.questions.map((q) => ({
        ...q,
        sortOrder: q.sortOrder || 1,
        options: q.options.map((o, oIdx) => ({
          ...o,
          sortOrder: oIdx + 1,
        })),
      })),
    }

    setSubmittedQuiz(normalized)
    setExportedJson('')
  }

  const handleExportJson = () => {
    if (!submittedQuiz) return
    setExportedJson(JSON.stringify(submittedQuiz, null, 2))
  }

  const handleImportFromJson = () => {
    try {
      const parsed = JSON.parse(importText) as Quiz
      if (!parsed || typeof parsed !== 'object') throw new Error('Invalid JSON')

      const withIds: Quiz = {
        ...parsed,
        questions: (parsed.questions ?? []).map((q) => ({
          ...q,
          id: q.id || crypto.randomUUID(),
          options: (q.options ?? []).map((o) => ({
            ...o,
            id: o.id || crypto.randomUUID(),
          })),
        })),
      }

      reset(withIds)
      setSubmittedQuiz(null)
      setExportedJson('')
    } catch {
      alert('Không thể parse JSON hoặc dữ liệu không hợp lệ.')
    }
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto flex max-w-6xl flex-col gap-6 py-10"
      >
        <header className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              Quiz Editor
            </h1>
            <p className="text-sm text-slate-600">
              Tạo / chỉnh sửa quiz trắc nghiệm và xuất ra JSON.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge>React + Tailwind</Badge>
            <Button type="submit">Submit quiz</Button>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)]">
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="grid gap-4 md:grid-cols-2">
                <TextInput
                  label="Tên quiz"
                  required
                  placeholder="VD: OnDigi Frontend Interview"
                  {...register('name', { required: 'Tên quiz là bắt buộc.' })}
                  error={errors.name?.message}
                />
                <TextInput
                  label="Mô tả ngắn"
                  required
                  placeholder="Mô tả mục tiêu, nội dung quiz..."
                  {...register('description', {
                    required: 'Mô tả quiz là bắt buộc.',
                  })}
                  error={errors.description?.message}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-800">
                  Danh sách câu hỏi
                </h2>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => append(createEmptyQuestion(fields.length))}
                >
                  + Thêm câu hỏi
                </Button>
              </div>

              {errors.questions?.message && (
                <p className="text-xs text-rose-500">
                  {errors.questions.message}
                </p>
              )}

              <div className="space-y-4">
                {fields.map((field, index) => (
                  <QuestionEditor
                    key={field.id}
                    index={index}
                    onRemove={() => remove(index)}
                  />
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="mb-3 text-sm font-semibold text-slate-800">
                Preview quiz
              </h2>
              {!submittedQuiz ? (
                <p className="text-xs text-slate-500">
                  Nhấn <strong>Submit quiz</strong> để xem bảng câu hỏi preview.
                </p>
              ) : (
                <div className="space-y-4 text-sm text-slate-800">
                  <div>
                    <h3 className="text-base font-semibold">
                      {submittedQuiz.name}
                    </h3>
                    <p className="text-xs text-slate-600">
                      {submittedQuiz.description}
                    </p>
                  </div>
                  <div className="space-y-3">
                    {submittedQuiz.questions
                      .slice()
                      .sort((a, b) => a.sortOrder - b.sortOrder)
                      .map((q, idx) => (
                        <div
                          key={q.id}
                          className="rounded-lg border border-slate-200 bg-slate-50 p-3"
                        >
                          <div className="mb-1 flex items-center justify-between">
                            <p className="text-sm font-semibold">
                              Câu {idx + 1}: {q.name}
                            </p>
                            <span className="text-[11px] text-slate-500">
                              Thứ tự: {q.sortOrder}
                            </span>
                          </div>
                          <p className="mb-2 text-xs text-slate-600">
                            {q.description}
                          </p>
                          <div className="overflow-x-auto">
                            <table className="min-w-full border-collapse text-xs">
                              <thead>
                                <tr className="bg-slate-100">
                                  <th className="border border-slate-200 px-2 py-1 text-left">
                                    #
                                  </th>
                                  <th className="border border-slate-200 px-2 py-1 text-left">
                                    Nhãn
                                  </th>
                                  <th className="border border-slate-200 px-2 py-1 text-left">
                                    Value
                                  </th>
                                  <th className="border border-slate-200 px-2 py-1 text-left">
                                    Đúng?
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {q.options
                                  .slice()
                                  .sort((a, b) => a.sortOrder - b.sortOrder)
                                  .map((o, oIdx) => {
                                    const isCorrect =
                                      q.correctOptionValues.includes(o.value)
                                    return (
                                      <tr key={o.id}>
                                        <td className="border border-slate-200 px-2 py-1">
                                          {oIdx + 1}
                                        </td>
                                        <td className="border border-slate-200 px-2 py-1">
                                          {o.label}
                                        </td>
                                        <td className="border border-slate-200 px-2 py-1 font-mono">
                                          {o.value}
                                        </td>
                                        <td className="border border-slate-200 px-2 py-1">
                                          {isCorrect ? (
                                            <span className="rounded bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                                              Đúng
                                            </span>
                                          ) : (
                                            <span className="text-[11px] text-slate-400">
                                              Sai
                                            </span>
                                          )}
                                        </td>
                                      </tr>
                                    )
                                  })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="mb-3 text-sm font-semibold text-slate-800">
                Xuất JSON
              </h2>
              <p className="mb-2 text-xs text-slate-500">
                Sau khi đã kiểm tra preview, nhấn nút dưới để sinh JSON từ quiz
                đã submit.
              </p>
              <Button
                type="button"
                onClick={handleExportJson}
                disabled={!submittedQuiz || hasChangesSinceSubmit}
              >
                Xuất JSON
              </Button>
              {exportedJson && (
                <div className="mt-3">
                  <TextArea
                    label="JSON"
                    value={exportedJson}
                    readOnly
                    className="font-mono text-xs"
                  />
                </div>
              )}
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="mb-3 text-sm font-semibold text-slate-800">
                Tải quiz từ JSON
              </h2>
              <p className="mb-2 text-xs text-slate-500">
                Dán JSON đã export trước đó để tiếp tục chỉnh sửa quiz.
              </p>
              <Button
                type="button"
                variant="ghost"
                className="mb-2"
                onClick={() => setShowImport((prev) => !prev)}
              >
                {showImport ? 'Ẩn vùng nhập JSON' : 'Hiện vùng nhập JSON'}
              </Button>
              {showImport && (
                <div className="space-y-2">
                  <TextArea
                    label="JSON"
                    placeholder='{\n  "name": "...",\n  "description": "...",\n  "questions": [...]\n}'
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                    className="font-mono text-xs"
                  />
                  <div className="flex justify-end">
                    <Button type="button" onClick={handleImportFromJson}>
                      Load từ JSON
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </section>
      </form>
    </FormProvider>
  )
}
