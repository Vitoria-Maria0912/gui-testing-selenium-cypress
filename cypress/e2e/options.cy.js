describe('options', () => {

  beforeEach(() => {
    cy.visit('/admin');
    cy.get('[id="_username"]').type('sylius');
    cy.get('[id="_password"]').type('sylius');
    cy.get('.primary').click();
    cy.clickInFirst('a[href="/admin/product-options/"]');
  });

  it('edit size XL to GG in Portuguese (Portugal)', () => {
    // Click in options in side menu
    cy.clickInFirst('a[href="/admin/product-options/"]');
    // Type in value input to search for specify option
    cy.get('[id="criteria_search_value"]').type('jeans_size');
    // Click in filter blue button
    cy.get('*[class^="ui blue labeled icon button"]').click();
    // Click in edit of the remain option
    cy.get('*[class^="ui labeled icon button "]').last().click();
    // Edit options values for XL size to GG
    cy.get('[id="sylius_product_option_values_3_translations_pt_PT_value"]').scrollIntoView().clear().type('GG');
    // Click on Save changes button
    cy.get('[id="sylius_save_changes_button"]').scrollIntoView().click();

    // Assert that option has been updated
    cy.get('body').should('contain', 'Product option has been successfully updated.');
  });

  it('create a new product, forgetting to add a product name in English', () => {
    cy.get('*[class^="ui right floated buttons"]').click();
    cy.get('#sylius_product_option_code').type("13747397");
    cy.get('#sylius_product_option_position').type(999);
    cy.get('*[class^="ui styled fluid accordion"]');
    cy.contains('.title', 'Spanish (Mexico)').click();
    cy.get('#sylius_product_option_translations_es_MX_name').type("Teste");
    cy.contains('*[class^="ui labeled icon button"]', 'Add value').click();
    cy.get('#sylius_product_option_values_0_code').type("7485899");
    cy.get('#sylius_product_option_values_0_translations_en_US_value').type("Teste");
    cy.contains('*[class^="ui labeled icon primary button"]', 'Create').click();
    
    // Assert that product has been created
    cy.get('body').should('contain', 'This form contains errors.')
  });

  it('filter by product name, with contains', () => {
      cy.get('#criteria_search_type').select('Contains');
      cy.get('#criteria_search_value').click().type('size');
      cy.get('*[class^="ui blue labeled icon button"]').last().click();
      cy.clickInFirst('*[class^="sortable sylius-table-column-name"]');
      cy.url().should('include', 'asc');
      cy.get('body').should('contain', 'T-shirt size');
  });

  it('try to delete a product, but givin up', () => {

    cy.get('.ui.red.labeled.icon.button').then(buttons => {
      const buttonsLength = buttons.length;

      if (buttonsLength > 0) {

        cy.wrap(buttons[1]).click();
        cy.get('#confirmation-modal', { timeout: 10000 }).should('be.visible');
        cy.get('*[class^="remove icon"]', { timeout: 10000 }).should('be.visible').click();

        // Verifica se há a mesma quantidade de produtos do início
        cy.get(buttons).should('have.length', buttonsLength);
        
        // Verifica se o produto não foi deletado
        cy.get('body').should('include.text', 'T-shirt size');
      }
    });
  });

  it('edit a product name `t_shirt_size` to `blusengröße` in German (Germany)', () => {
    cy.get('*[class^="ui labeled icon button"]').eq(2).click();
    cy.get('*[class^="ui styled fluid accordion"]');
    cy.get('.title').eq(1).click();
    cy.get('#sylius_product_option_translations_de_DE_name').should('be.visible').clear().type("blusengröße");
    cy.get('#sylius_save_changes_button').click();
    cy.get('body', { timeout: 10000 }).should('contain', 'Product option has been successfully updated.');
  });

  it('', () => {});

  // Lucas - Cypress

  it('delete a product', () => {});

  it('delete some product options', () => {});

  it('edit a product size `S` to `P` in Spanish (Spain)', () => {});

  it('filter by product name, with equals', () => {});

  it('', () => {});
});
