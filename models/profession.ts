export interface IProfession {
  id?: number,
  title: string,
  salary?: number,
  responsibilities?: Set<string> | Array<string>
}
