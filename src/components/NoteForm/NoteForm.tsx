import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import css from "./NoteForm.module.css";
import type { CreateNoteParams } from "../../services/noteService";
import { createNote } from "../../services/noteService";
import { toast } from "react-hot-toast";

export interface NoteFormProps {
  onSubmit: (values: CreateNoteParams) => void;
  onCancel: () => void;
}

const validationSchema = Yup.object().shape({
  title: Yup.string().min(3).max(50).required("Required"),
  content: Yup.string().max(500),
  tag: Yup.string()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
    .required("Required"),
});

export default function NoteForm({ onCancel }: NoteFormProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newNote: CreateNoteParams) => createNote(newNote),
    onSuccess: () => {
      toast.success("Note created");
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onCancel(); // закриває модалку
    },
    onError: () => {
      toast.error("Failed to create note");
    },
  });

  const initialValues: CreateNoteParams = {
    title: "",
    content: "",
    tag: "Todo",
  };

  return (
    <Formik<CreateNoteParams>
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        mutation.mutate(values);
      }}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field name="title" id="title" className={css.input} />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="content">Content</label>
          <Field
            as="textarea"
            name="content"
            id="content"
            rows={8}
            className={css.textarea}
          />
          <ErrorMessage name="content" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="tag">Tag</label>
          <Field as="select" name="tag" id="tag" className={css.select}>
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage name="tag" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button type="button" className={css.cancelButton} onClick={onCancel}>
            Cancel
          </button>
          <button
            type="submit"
            className={css.submitButton}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Creating..." : "Create note"}
          </button>
        </div>
      </Form>
    </Formik>
  );
}
