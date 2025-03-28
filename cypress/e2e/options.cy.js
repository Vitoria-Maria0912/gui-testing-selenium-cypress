describe('options', () => {
  beforeEach(() => {
    cy.visit('/admin', { timeout: 10000 });
    cy.get('[id="_username"]', { timeout: 10000 }).type('sylius');
    cy.get('[id="_password"]', { timeout: 10000 }).type('sylius');
    cy.get('.primary', { timeout: 10000 }).click();
    cy.clickInFirst('a[href="/admin/product-options/"]', { timeout: 10000 });
  });

  it('edit size XL to GG in Portuguese (Portugal)', () => {
    cy.get('[id="criteria_search_value"]', { timeout: 10000 }).type('jeans_size');
    cy.get('*[class^="ui blue labeled icon button"]', { timeout: 10000 }).click();
    cy.get('*[class^="ui labeled icon button "]', { timeout: 10000 }).last().click();
    cy.get('[id="sylius_product_option_values_3_translations_pt_PT_value"]', { timeout: 10000 })
      .scrollIntoView()
      .clear()
      .type('GG');
    cy.get('[id="sylius_save_changes_button"]', { timeout: 10000 }).scrollIntoView().click();
    cy.get('body', { timeout: 10000 }).should('contain', 'Product option has been successfully updated.');
  });

  it('create a new product, forgetting to add a product name in English', () => {
    cy.get('*[class^="ui right floated buttons"]', { timeout: 20000 }).click();
    cy.get('#sylius_product_option_code', { timeout: 10000 }).type("13747397");
    cy.get('#sylius_product_option_position', { timeout: 10000 }).type(999);
    cy.get('*[class^="ui styled fluid accordion"]', { timeout: 10000 });
    cy.contains('.title', 'Spanish (Mexico)', { timeout: 10000 }).click();
    cy.get('#sylius_product_option_translations_es_MX_name', { timeout: 10000 }).type("Teste");
    cy.contains('*[class^="ui labeled icon button"]', 'Add value', { timeout: 10000 }).click();
    cy.get('#sylius_product_option_values_0_code', { timeout: 10000 }).type("7485899");
    cy.get('#sylius_product_option_values_0_translations_en_US_value', { timeout: 20000 }).type("Teste");
    cy.contains('*[class^="ui labeled icon primary button"]', 'Create', { timeout: 20000 }).click();
    cy.get('body', { timeout: 10000 }).should('contain', 'This form contains errors.');
  });

  it('filter by product name, with contains', () => {
    cy.get('#criteria_search_type', { timeout: 10000 }).select('Contains');
    cy.get('#criteria_search_value', { timeout: 10000 }).click().type('size');
    cy.get('*[class^="ui blue labeled icon button"]', { timeout: 10000 }).last().click();
    cy.clickInFirst('*[class^="sortable sylius-table-column-name"]', { timeout: 10000 });
    cy.url({ timeout: 10000 }).should('include', 'asc');
    cy.get('body', { timeout: 10000 }).should('contain', 'T-shirt size');
  });

  it('try to delete a product, but giving up', () => {
    cy.get('.ui.red.labeled.icon.button', { timeout: 10000 }).then(buttons => {
      const buttonsLength = buttons.length;
      if (buttonsLength > 0) {
        cy.wrap(buttons[1], { timeout: 10000 }).click();
        cy.get('#confirmation-modal', { timeout: 10000 }).should('be.visible');
        cy.get('*[class^="remove icon"]', { timeout: 10000 }).should('be.visible').click();
        cy.get(buttons, { timeout: 10000 }).should('have.length', buttonsLength);
        cy.get('body', { timeout: 10000 }).should('include.text', 'T-shirt size');
      }
    });
  });

  it('create a new product successfully', () => {
    cy.get('*[class^="ui right floated buttons"]', { timeout: 20000 }).click();
    cy.get('#sylius_product_option_code', { timeout: 10000 }).type("98765432");
    cy.get('#sylius_product_option_position', { timeout: 10000 }).type(100);
    cy.get('*[class^="ui styled fluid accordion"]', { timeout: 10000 });

    cy.contains('.title', 'English (United States)', { timeout: 10000 }).click();
    cy.get('#sylius_product_option_translations_en_US_name', { timeout: 10000 }).type("Test Product");
  
    cy.contains('.title', 'Spanish (Mexico)', { timeout: 10000 }).click();
    cy.get('#sylius_product_option_translations_es_MX_name', { timeout: 10000 }).type("Producto de Prueba");
  
    cy.contains('*[class^="ui labeled icon button"]', 'Add value', { timeout: 10000 }).click();
    cy.get('#sylius_product_option_values_0_code', { timeout: 10000 }).type("123456");
    cy.get('#sylius_product_option_values_0_translations_en_US_value', { timeout: 20000 }).type("Option 1");
  
    cy.contains('*[class^="ui labeled icon primary button"]', 'Create', { timeout: 20000 }).click();
  
    // Verifica se o produto foi criado com sucesso
    cy.get('body', { timeout: 10000 }).should('contain', 'Product option has been successfully created.');
  });
  

  it('edit a product name `t_shirt_size` to `blusengröße` in German (Germany)', () => {
    cy.get('*[class^="ui labeled icon button"]', { timeout: 10000 }).eq(2).click();
    cy.get('*[class^="ui styled fluid accordion"]', { timeout: 10000 });
    cy.get('.title', { timeout: 10000 }).eq(1).click();
    cy.get('#sylius_product_option_translations_de_DE_name', { timeout: 10000 })
      .should('be.visible')
      .clear()
      .type("blusengröße");
    cy.get('#sylius_save_changes_button', { timeout: 10000 }).click();
    cy.get('body', { timeout: 10000 }).should('contain', 'Product option has been successfully updated.');
  });

  it('delete some product options', () => {
    cy.get('.ui.red.labeled.icon.button', { timeout: 10000 }).then(buttons => {
      const buttonsLength = buttons.length;
      if (buttonsLength > 0) {
        cy.wrap(buttons[1], { timeout: 10000 }).click();
        cy.get('#confirmation-modal', { timeout: 10000 }).should('be.visible');
        cy.get('.bulk-select-checkbox[value="2"]', { timeout: 10000 })
          .scrollIntoView()
          .should('be.visible')
          .click({ force: true });
        cy.get('.bulk-select-checkbox[value="3"]', { timeout: 10000 })
          .scrollIntoView()
          .should('be.visible')
          .click({ force: true });
        cy.get('.ui.red.labeled.icon.button[type="submit"]:not([disabled])', { timeout: 10000 })
          .first()
          .click({ force: true });
        cy.get('#confirmation-modal', { timeout: 10000 }).should('be.visible');
        cy.get('*[id="confirmation-button"]', { timeout: 10000 }).should('be.visible').click();
        cy.get('.ui.red.labeled.icon.button', { timeout: 10000 }).should('have.length', buttonsLength - 2);
        cy.get('body', { timeout: 10000 }).should('not.contain.text', 'Dress size');
        cy.get('body', { timeout: 10000 }).should('not.contain.text', 'Dress height');
      }
    });
  });

  it('delete a product', () => {
    cy.get('.ui.red.labeled.icon.button', { timeout: 10000 }).then(buttons => {
      const buttonsLength = buttons.length;
      if (buttonsLength > 0) {
        cy.wrap(buttons[1], { timeout: 10000 }).click();
        cy.get('#confirmation-modal', { timeout: 10000 }).should('be.visible');
        cy.get('*[id="confirmation-button"]', { timeout: 10000 }).should('be.visible').click();
        cy.get('.ui.red.labeled.icon.button', { timeout: 10000 }).should('have.length', buttonsLength - 1);
        cy.get('body', { timeout: 10000 }).should('not.contain.text', 'T-shirt size');
      }
    });
  });

  it('edit size S to P in Spanish (Spain)', () => {
    cy.get('*[class^="ui labeled icon button"]', { timeout: 10000 }).eq(2).click();
    cy.get('*[class^="ui styled fluid accordion"]', { timeout: 10000 });
    cy.get('.title', { timeout: 10000 }).eq(1).click();
    cy.get('[id="sylius_product_option_values_0_translations_es_ES_value"]', { timeout: 10000 })
      .scrollIntoView()
      .clear()
      .type('P');
    cy.get('[id="sylius_save_changes_button"]', { timeout: 10000 }).scrollIntoView().click();
    cy.get('body', { timeout: 10000 }).should('contain', 'Product option has been successfully updated.');
  });

  it('filter by product name, with equals', () => {
    cy.get('#criteria_search_type', { timeout: 10000 }).select('Equals');
    cy.get('#criteria_search_value', { timeout: 10000 }).click().type('T-shirt size');
    cy.get('*[class^="ui blue labeled icon button"]', { timeout: 10000 }).last().click();
    cy.clickInFirst('*[class^="sortable sylius-table-column-name"]', { timeout: 10000 });
    cy.url({ timeout: 10000 }).should('include', 'asc');
    cy.get('body', { timeout: 10000 }).should('contain', 'T-shirt size');
  });

});
