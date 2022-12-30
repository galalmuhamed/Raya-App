## Raya-App

> Full-Stack Application
>
> > Front-End
> >
> > - React.js
> > - React-Query
> > - TailwindCss
> > - Typescript
>
> > Back-End
> >
> > - ASP.Net Core Web Api
> > - Entity Framework Core
> > - SQL-Server
> > - JWTBearer

## Insallation

- Front-End
  - Look at README.md Inside client folder
- Backt-End
  - Look at README.md Inside server folder

## Description

this application has Users and Agents

Users they are having a role to register data, update data and delete data <br/>
agents they are actual data they have names and status, status could be New Or Approved

#### Roles

every user has a role

### <mark >Admin</mark>

1. he can add data and he can change status while he adding data.
2. he can update and delete data even if status = approved

### <mark >Any-Role</mark>

1. he can add data without setting status, while he adding data status will be set New automatically
2. he can update and Delete only data if status equal to New
3. he cant manipulate status
