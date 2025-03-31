import { Builder, By, until } from 'selenium-webdriver';
import assert from 'assert';

describe('options', () => {
  let driver;

  before(async () => {
    driver = await new Builder().forBrowser('firefox').build();
  });

  after(async () => {
    await driver.quit();
  });

  beforeEach(async () => {
    // Limpa os cookies e navega até a página
    await driver.manage().deleteAllCookies();
    await driver.get('http://localhost:8080/admin');

    // Aguarda o campo de username e preenche
    await driver.wait(until.elementLocated(By.id('_username')), 10000);
    await driver.findElement(By.id('_username')).sendKeys('sylius');

    // Preenche a senha
    await driver.findElement(By.id('_password')).sendKeys('sylius');

    // Aguarda o botão de login estar visível e habilitado antes de clicar
    const loginButton = await driver.wait(
      until.elementLocated(By.css('.primary')),
      10000
    );
    await driver.wait(until.elementIsVisible(loginButton), 10000);
    await driver.wait(until.elementIsEnabled(loginButton), 10000);
    await loginButton.click();

    // Aguarda e clica no link de Options
    await driver.wait(until.elementLocated(By.linkText('Options')), 10000);
    await driver.findElement(By.linkText('Options')).click();
  });

  it('edit size XL to GG in Portuguese (Portugal)', async () => {
    await driver.wait(until.elementLocated(By.id('criteria_search_value')), 10000);
    await driver.findElement(By.id('criteria_search_value')).sendKeys('jeans_size');

    // Clica no botão de filtro
    const filterButton = await driver.wait(
      until.elementLocated(By.css('*[class^="ui blue labeled icon button"]')),
      10000
    );
    await driver.wait(until.elementIsVisible(filterButton), 10000);
    await filterButton.click();

    // Aguarda e clica no botão de edição desejado
    const buttons = await driver.wait(
      until.elementsLocated(By.css('*[class^="ui labeled icon button "]')),
      10000
    );
    if (buttons.length > 1) {
      await buttons[1].click();
    } else {
      throw new Error("Botão de edição não encontrado!");
    }

    // Edita o valor da opção
    const inputName = await driver.wait(
      until.elementLocated(By.id('sylius_product_option_values_3_translations_pt_PT_value')),
      10000
    );
    await inputName.click();
    await inputName.clear();
    await inputName.sendKeys('GG');

    // Salva as mudanças e aguarda a mensagem de sucesso
    const saveButton = await driver.wait(
      until.elementLocated(By.id('sylius_save_changes_button')),
      10000
    );
    await saveButton.click();

    await driver.wait(
      until.elementLocated(By.xpath("//*[contains(text(), 'Product option has been successfully updated.')]")),
      10000
    );
    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('Product option has been successfully updated.'));
  });

  it('trying to create a product, but canceling the creation', async () => {
    const createButton = await driver.wait(
      until.elementLocated(By.css('.ui.labeled.icon.button.primary')),
      10000
    );
    await driver.wait(until.elementIsVisible(createButton), 10000);
    await createButton.click();

    await driver.wait(until.elementLocated(By.id('sylius_product_option_code')), 10000);
    await driver.findElement(By.id('sylius_product_option_code')).sendKeys('test_code');
    await driver.findElement(By.id('sylius_product_option_position')).sendKeys('1');

    const cancelButton = await driver.wait(
      until.elementLocated(By.css('a.ui.button')),
      10000
    );
    await driver.wait(until.elementIsVisible(cancelButton), 10000);
    await cancelButton.click();

    // Verifica se a URL foi redirecionada corretamente para a página de opções de produto
    const currentUrl = await driver.getCurrentUrl();
    assert(
      currentUrl.includes('/admin/product-options/'),
      `Expected to be on /admin/product-options/, but was on ${currentUrl}`
    );

    // Verifica se algum elemento específico na página de opções de produto está presente
    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('Options'), 'Expected to find "Options" on the page, but it was not found.');
  });

  it('trying to create a new product, forgetting to add a product name in English', async () => {
    // Clica no link de Options para garantir que está na página certa
    await driver.wait(until.elementLocated(By.linkText('Options')), 10000);
    await driver.findElement(By.linkText('Options')).click();

    const createButton = await driver.wait(
      until.elementLocated(By.css('.ui.labeled.icon.button.primary')),
      10000
    );
    await driver.wait(until.elementIsVisible(createButton), 10000);
    await createButton.click();

    // Preenche os campos obrigatórios, exceto o nome do produto em inglês
    await driver.wait(until.elementLocated(By.id('sylius_product_option_code')), 10000);
    await driver.findElement(By.id('sylius_product_option_code')).sendKeys('test_code');
    await driver.findElement(By.id('sylius_product_option_position')).sendKeys('1');

    const submitButton = await driver.wait(
      until.elementLocated(By.css('.ui.labeled.icon.primary.button')),
      10000
    );
    await driver.wait(until.elementIsVisible(submitButton), 10000);
    await submitButton.click();

    // Verifica se a mensagem de erro foi exibida
    await driver.wait(
      until.elementLocated(By.xpath("//*[contains(text(), 'This form contains errors.')]")),
      10000
    );
    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('This form contains errors.'));
  });

  it('filter by product name, with contains', async () => {
    const optionsLink = await driver.wait(
      until.elementLocated(By.linkText('Options')),
      10000
    );
    await driver.wait(until.elementIsVisible(optionsLink), 10000);
    await optionsLink.click();

    const searchType = await driver.wait(
      until.elementLocated(By.id('criteria_search_type')),
      10000
    );
    await searchType.sendKeys('Contains');

    const searchValue = await driver.wait(
      until.elementLocated(By.id('criteria_search_value')),
      10000
    );
    await searchValue.click();
    await searchValue.sendKeys('size');

    const filterButton = await driver.wait(
      until.elementLocated(By.css('*[class^="ui blue labeled icon button"]')),
      10000
    );
    await driver.wait(until.elementIsVisible(filterButton), 10000);
    await filterButton.click();

    const nameColumn = await driver.wait(
      until.elementLocated(By.css('*[class^="sortable sylius-table-column-name"]')),
      10000
    );
    await driver.wait(until.elementIsVisible(nameColumn), 10000);
    await nameColumn.click();

    const currentUrl = await driver.getCurrentUrl();
    assert(currentUrl.includes('asc'));

    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('T-shirt size'));
  });

  it('trying to delete a product, but canceling the deletion ', async () => {
    const deleteButtons = await driver.wait(
      until.elementsLocated(By.css('.ui.red.labeled.icon.button')),
      10000
    );
    const buttonsLength = deleteButtons.length;

    if (buttonsLength > 1) {
      await deleteButtons[1].click();

      const confirmationModal = await driver.wait(
        until.elementLocated(By.id('confirmation-modal')),
        10000
      );
      await driver.wait(until.elementIsVisible(confirmationModal), 10000);

      // Clica no ícone para fechar o modal
      const removeIcon = await driver.wait(
        until.elementLocated(By.css('*[class^="remove icon"]')),
        10000
      );
      await driver.wait(until.elementIsVisible(removeIcon), 10000);
      await removeIcon.click();

      const updatedDeleteButtons = await driver.findElements(By.css('.ui.red.labeled.icon.button'));
      assert.strictEqual(updatedDeleteButtons.length, buttonsLength);

      const bodyText = await driver.findElement(By.tagName('body')).getText();
      assert(bodyText.includes('T-shirt size'));
    }
  });

  it('create a new product successfully', async () => {
    // Aguarda o botão Create e clica nele
    const createButton = await driver.wait(
      until.elementLocated(By.css('.ui.labeled.icon.button.primary')),
      10000
    );
    await driver.wait(until.elementIsVisible(createButton), 10000);
    await createButton.click();

    const url = await driver.getCurrentUrl();
    assert(url.includes('new'));

    await driver.wait(until.elementLocated(By.id('sylius_product_option_code')), 10000);
    await driver.findElement(By.id('sylius_product_option_code')).sendKeys('mini_falda');
    await driver.findElement(By.id('sylius_product_option_position')).sendKeys('5');

    const countries = await driver.wait(
      until.elementsLocated(By.css('.ui.styled.fluid.accordion')),
      10000
    );
    await countries[0].click();

    await driver.wait(
      until.elementLocated(By.id('sylius_product_option_translations_en_US_name')),
      10000
    );
    await driver.findElement(By.id('sylius_product_option_translations_en_US_name')).sendKeys('short_skirt');

    const saveButton = await driver.wait(
      until.elementLocated(By.css('.ui.labeled.icon.primary.button')),
      10000
    );
    await driver.wait(until.elementIsVisible(saveButton), 10000);
    await saveButton.click();

    await driver.wait(
      until.elementLocated(By.xpath("//*[contains(text(), 'Product option has been successfully created.')]")),
      10000
    );
    const body = await driver.findElement(By.tagName('body')).getText();
    assert(body.includes('Product option has been successfully created.'));
  });

  it('edit a product name `t_shirt_size` to `blusengröße` in German (Germany)', async () => {
    const editButtons = await driver.wait(
      until.elementsLocated(By.css('*[class^="ui labeled icon button"]')),
      10000
    );
    if (editButtons.length > 2) {
      await editButtons[2].click();
    } else {
      throw new Error("Botão de edição não encontrado para o teste em alemão.");
    }

    await driver.wait(
      until.elementLocated(By.css('*[class^="ui styled fluid accordion"]')),
      10000
    );
    const titles = await driver.wait(
      until.elementsLocated(By.css('.title')),
      10000
    );
    if (titles.length > 1) {
      await titles[1].click();
    } else {
      throw new Error("Título não encontrado para expandir a seção de idiomas.");
    }

    const germanNameInput = await driver.wait(
      until.elementLocated(By.id('sylius_product_option_translations_de_DE_name')),
      10000
    );
    await driver.wait(until.elementIsVisible(germanNameInput), 10000);
    await germanNameInput.clear();
    await germanNameInput.sendKeys('blusengröße');

    const saveButton = await driver.wait(
      until.elementLocated(By.id('sylius_save_changes_button')),
      10000
    );
    await saveButton.click();

    await driver.wait(
      until.elementLocated(By.xpath("//*[contains(text(), 'Product option has been successfully updated.')]")),
      10000
    );
    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('Product option has been successfully updated.'));
  });

  it('delete some product options', async () => {
    const checkboxes = await driver.wait(
      until.elementsLocated(By.css('.bulk-select-checkbox')),
      10000
    );
    let bodyText;
    if (checkboxes.length === 0) {
      bodyText = await driver.findElement(By.tagName('body')).getText();
      assert(bodyText.includes('There are no results to display'));
    } else if (checkboxes.length > 1) {
      await checkboxes[0].click();
      await checkboxes[1].click();

      const buttons = await driver.wait(
        until.elementsLocated(By.css('.ui.red.labeled.icon.button')),
        10000
      );
      await buttons[0].click();

      const modal = await driver.wait(
        until.elementLocated(By.css('#confirmation-modal')),
        10000
      );
      await driver.wait(until.elementIsVisible(modal), 10000);

      const confirmButton = await driver.wait(
        until.elementLocated(By.css('#confirmation-button')),
        10000
      );
      await driver.wait(until.elementIsEnabled(confirmButton), 10000);
      await confirmButton.click();

      bodyText = await driver.findElement(By.tagName('body')).getText();
      assert(bodyText.includes('Product_options have been successfully deleted.'));
    }
  });

  it('delete a product', async () => {
    const buttons = await driver.wait(
      until.elementsLocated(By.css('.ui.red.labeled.icon.button')),
      10000
    );
    let bodyText;
    if (buttons.length > 0) {
      await buttons[1].click();

      const modal = await driver.wait(
        until.elementLocated(By.css('#confirmation-modal')),
        10000
      );
      await driver.wait(until.elementIsVisible(modal), 10000);

      const confirmButton = await driver.wait(
        until.elementLocated(By.css('#confirmation-button')),
        10000
      );
      await driver.wait(until.elementIsEnabled(confirmButton), 10000);
      await confirmButton.click();

      bodyText = await driver.findElement(By.tagName('body')).getText();
      assert(bodyText.includes('Product option has been successfully deleted.'));
    } else {
      bodyText = await driver.findElement(By.tagName('body')).getText();
      assert(bodyText.includes('There are no results to display'));
    }
  });

  it('edit a product size `S` to `P` in Spanish (Spain)', async () => {
    const buttons = await driver.wait(
      until.elementsLocated(By.css('*[class^="ui labeled icon button"]')),
      10000
    );
    let body;
    if (buttons.length > 2) {
      await buttons[2].click();
      const currentUrl = await driver.getCurrentUrl();
      assert(currentUrl.includes('edit'));

      const inputSize = await driver.wait(
        until.elementLocated(By.id('sylius_product_option_values_0_translations_es_MX_value')),
        10000
      );
      await inputSize.clear();
      await inputSize.sendKeys('P');

      const saveButton = await driver.wait(
        until.elementLocated(By.id('sylius_save_changes_button')),
        10000
      );
      await saveButton.click();

      await driver.wait(
        until.elementLocated(By.xpath("//*[contains(text(), 'Product option has been successfully updated.')]")),
        10000
      );
      body = await driver.findElement(By.tagName('body')).getText();
      assert(body.includes('Product option has been successfully updated.'));
    } else {
      body = await driver.findElement(By.tagName('body')).getText();
      assert(body.includes('There are no results to display'));
    }
  });

  it('filter by product name, with equals', async () => {
    await driver.wait(until.elementLocated(By.id('criteria_search_type')), 10000);
    await driver.findElement(By.id('criteria_search_type')).sendKeys('Equal');
    await driver.findElement(By.id('criteria_search_value')).sendKeys('Jeans size');

    const filterButton = await driver.wait(
      until.elementLocated(By.css('.ui.blue.labeled.icon.button')),
      10000
    );
    await driver.wait(until.elementIsVisible(filterButton), 10000);
    await filterButton.click();

    const elements = await driver.wait(
      until.elementsLocated(By.css('*[class^="ui red labeled icon button"]')),
      10000
    );
    const body = await driver.findElement(By.tagName('body')).getText();

    if (elements.length >= 2) {
      const nameColumn = await driver.wait(
        until.elementLocated(By.css('*[class^="sortable sylius-table-column-name"]')),
        10000
      );
      await driver.wait(until.elementIsVisible(nameColumn), 10000);
      await nameColumn.click();

      const currentUrl = await driver.getCurrentUrl();
      assert(currentUrl.includes('asc'));
      assert(body.includes('Jeans size'));
    } else {
      assert(body.includes('There are no results to display'));
    }
  });
});
