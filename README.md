
This code challenge is a good opportunity to document my current workflow. I split development work into four phases: requirements, architecture & prototyping, construction & testing, deployment. This follows the classic SDLC and is a design-heavy approach which I take from 'Code Complete'

## Requirements

The wording of the problem statement is quite open-ended: a multi-user platform with scheduling and a messaging queue deployed with fault tolerance over k8s would be as acceptable a solution as a simpler solution. Since I have another coding challenge to complete and I also want to deliver a frontend, I decide to limit my solution to a minimalistic batch e-mail delivery tool without authentification, persistence, a message queue, etc.

## Architecture & Prototyping

For the backend I settle on this architecture:

(Remark: since UML lacks notation for standalone functions, I have modeled those as static methods of the 'global' class.)

For the frontend I sat down and drew a wireframe. I could have just delivered a form, but then why use React, so I chose to deliver a step sequence.

The definition of prototyping in the SDLC is to write the minimum amount of code necessary to clarify how to implement a certain feature. In this case, the only technical challenge was to understand how the APIs for Mailgun and Amazon SES work, so I signed up for their services and got wrote working queries using Postman. I then wrote the relevant code using Requests on a Jupyter notebook

## Construction

With all of that architecture and design work, writing the backend is now a trivial matter. I like to work from high-level to low-level, so I start by setting up the folder structure, then write out the classes / functions without implementation, then write pseudocode/docstring and finally write the code. All of this was very fast, because the only tricky code I had already taken care of in that Jupyter notebook...
