class ApplicationController < ActionController::Base
  protect_from_forgery
  
  def hashify(content)
    Digest::MD5.hexdigest(content).first(7)
  end
end
