import { useSearchParams } from "react-router-dom"
import { z } from "zod"

export function usePatientFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const page = searchParams.get("page") ?? "1"

  const pageIndex = z.coerce
    .number()
    .transform((val) => val - 1)
    .parse(page)

  const filters = {
    pageIndex: Math.max(0, pageIndex),
    perPage: Number(searchParams.get("perPage") ?? "10"),
    name: searchParams.get("name"),
    cpf: searchParams.get("cpf"),
    status: searchParams.get("status"),
  }

  function setPage(pageIndex: number) {
    setSearchParams((state) => {
      state.delete("pageIndex")
      state.set("page", (pageIndex + 1).toString())
      return state
    })
  }

  function setFilters(newFilters: Partial<typeof filters>) {
    setSearchParams((state) => {
      state.delete("pageIndex")

      if (newFilters.name) state.set("name", newFilters.name)
      else state.delete("name")

      if (newFilters.cpf) state.set("cpf", newFilters.cpf)
      else state.delete("cpf")

      if (newFilters.status) state.set("status", newFilters.status)
      else state.delete("status")

      state.set("page", "1")

      return state
    })
  }

  function clearFilters() {
    setSearchParams((state) => {
      state.delete("name")
      state.delete("cpf")
      state.delete("status")
      state.delete("pageIndex")
      state.set("page", "1")
      return state
    })
  }

  return { filters, setPage, setFilters, clearFilters }
}