class EditController < ApplicationController
  def copy
  end
  
  def view
    @blob = Blob.find_by_hash(params[:id])
  end
  
  def make_blob
    content = params[:content]
    hash = Digest::MD5.hexdigest(content).first(7)
    begin Blob.create(:hash => hash, :content => content, :raw => params[:raw]) rescue p "oops" end
    render :text => hash
  end
  
  def regen_blob
    content = params[:content]
    old_hash = params[:old_hash]
    hash = Digest::MD5.hexdigest(content).first(7)
    begin
      b = Blob.find_by_hash(old_hash)
      b.content = content; b.hash = hash; b.raw = params[:raw]
      b.save
    rescue
      p "oops"
    end
    render :text => hash
  end
end