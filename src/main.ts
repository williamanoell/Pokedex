import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'; // Importa o método para inicializar a aplicação no navegador

import { AppModule } from './app/app.module'; // Importa o módulo principal da aplicação


// Inicializa a aplicação usando o AppModule
platformBrowserDynamic()
  .bootstrapModule(AppModule)  // Inicializa o módulo principal
  .catch(err => console.error(err));  // Captura e exibe qualquer erro que ocorra durante a inicialização
