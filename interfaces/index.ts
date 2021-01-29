export type CategoryType = {
  id: number,
  name: string,
  color: string,
}

export type SelectCategory = {
  id: number,
  indexWords: Array<number>,
  type: CategoryType
}

export type File = {
  words: Array<string>
  selectWords: Array<SelectCategory>
}
