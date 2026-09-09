import { IsNotEmpty, IsString, IsBoolean, Matches } from "class-validator";
export class CreateProductCategoryDto {
    @IsNotEmpty({ message: 'category name should contain only alphabets, spaces, or hyphens' })
    @IsString()
    @Matches(/^[a-zA-Z\s-&,]+$/)
    name: string;

    @IsNotEmpty({ message: 'category slug should be unique not empty' })
    @IsString()
    @Matches(/^[a-zA-Z0-9-]+$/)
    slug: string;


    @IsString()
    @Matches(/^[a-zA-Z0-9\s\-&(),.':;!?]+$/)
    description?: string;

    @IsBoolean()
    isActive?: boolean = true;
}
