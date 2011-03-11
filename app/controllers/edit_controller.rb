class EditController < ApplicationController
  def copy
  end
  
  def view
    @blob = Blob.find_by_hash(params[:id])
  end
  
  def make_blob
    content = params[:content]
    hash = Digest::MD5.hexdigest(content).first(7)
    begin Blob.create(:hash => hash, :content => content) rescue p "oops" end
    render :text => hash
  end
end