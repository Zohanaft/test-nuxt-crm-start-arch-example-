export interface IEmployee {
  id?: number,
  name: string,
  surname: string,
  birthday: Date,
  picture: {
    large: string,
    medium: string,
    thumbnail: string
  },
  professions?: Array<number>
}
