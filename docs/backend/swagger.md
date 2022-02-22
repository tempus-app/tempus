## NestJS Swagger

Documentation taken from NestJs OPEN API documentation (https://docs.nestjs.com/openapi/introduction).

The SwaggerModule automatically reflects all of your endpoints.

```
const swaggerConfig = new DocumentBuilder()
    .setTitle('Tempus')
    .setDescription('The tempus API')
    .setVersion('1.0')
    .addTag('tempus')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);
```

The SwaggerModule searches for all @Body(), @Query(), and @Param() decorators in route handlers to generate the API document. It also creates corresponding model definitions by taking advantage of reflection. Consider the following code:

## Tags

To attach a controller to a specific tag, use the @ApiTags(...tags) decorator.

```
@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('create-user')
  async createUserSwaggerExample(@Body() createUserDto: SlimUserDto) {
    this.appService.createUser();
  }
```

In order to make the class properties visible to the SwaggerModule, we have to either annotate them with the @ApiProperty() decorator

```
import { ApiProperty } from '@nestjs/swagger'

export class SlimUserDto {
  id: number

  @ApiProperty()
  firstName: string

  @ApiProperty()
  lastName: string

  @ApiProperty()
  email: string

  @ApiProperty()
  password: string

```

### Types

In order to explicitly set the type of the property, use the type key:

```
@ApiProperty({
  type: Number,
})
age: number;
```

### Circular Dependency

When you have circular dependencies between classes, use a lazy function to provide the `SwaggerModule` with type information:

### Enums

To identify an enum, we must manually set the enum property on the @ApiProperty with an array of values.

```
  @ApiProperty({ enum: ['ASSIGNED_RESOURCE', 'AVAILABLE_RESOURCE', 'BUSINESS_OWNER', 'SUPERVISOR']})
  roles: RoleType[]
```

![swagger example](https://github.com/tempus-app/tempus/blob/feature-api/open-api-support/docs/screenshots/swagger-request.PNG)

Now requests can be made to these endpoints by visiting `http://localhost:3000/api`
