class HomePage
  include PageObject

  include URL
  def self.url
    URL.url('Main_Page')
  end
  page_url url

  a(:mainmenu_button, id: 'mw-mf-main-menu-button')
  a(:login_button, href: /Special:UserLogin/)
  a(:login, text: 'Login')
  ul(:search_results, class: 'suggestions-results')
  a(:search_result) do |page|
    page.search_results_element.a
  end
  text_field(:search_box, name: 'search')
  div(:main_page, id: 'mainpage')
  a(:watch_link, class: 'watch-this-article')
  a(:watched_link, class: 'watch-this-article watched')
  div(:watch_note, text: 'Added San Francisco Chronicle to your watchlist')
  div(:watch_note_removed, text: 'Removed San Francisco Chronicle from your watchlist')
  button(:openfooter_button, class:   'openSection')
  span(:mobile_select, text: 'Mobile')
  a(:contrib_link, text: 'contributors')
  a(:content_link, text: 'CC BY-SA 3.0')
  a(:terms_link, text: 'Terms of Use')
  a(:privacy_link, text: 'Privacy')
  a(:about_link, text: 'About')
  a(:disclaimer_link, text: 'Disclaimers')
  form(:search_form, id: 'mw-mf-searchForm')
  a(:sign_up, text: 'Sign up')
  div(:main_page, id: 'mainpage')
end
