export class CreateBoxDTO {
  constructor(
    public name: string,
    public credentials: Record<string, string>,
    public favorite: boolean,
    public status: string,
    public icon: string,
    public id?: string
  ) {}

  static create(object: { [key: string]: any }): [string?, CreateBoxDTO?] {
    const { name, credentials, favorite, status, icon, id } = object;

    if (!name) return ['Name is required'];
    if (!credentials || typeof credentials !== 'object')
      return ['Credentials must be an object'];
    if (favorite === undefined) return ['Favorite is required'];
    if (!status) return ['Status is required'];
    if (!icon) return ['Icon is required'];
    return [
      undefined,
      new CreateBoxDTO(name, credentials, favorite, status, icon, id),
    ];
  }
}
