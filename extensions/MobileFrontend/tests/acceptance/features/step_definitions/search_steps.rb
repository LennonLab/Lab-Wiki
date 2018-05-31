Given /^I am on the home page$/ do
  visit(HomePage).main_page_element.should exist
end

When /^I type (.+)$/ do |search_term|
  on(HomePage).search_box_element.send_keys 'san'
end

Then /^Search box should be there$/ do
  on(HomePage).search_box_element.should exist
end
Then /^Search results should contain (.+)$/ do |text|
  on(HomePage).search_result_element.when_present.text.should == text
end
