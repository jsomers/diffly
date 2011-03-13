class CopyController < ApplicationController
  def edit
    nil
  end
  
  def view
    @blob = Blob.find_by_hash(params[:id])
  end
  
  def blobify
    params[:blob][:hash] = (hash = hashify(params[:blob][:content]))
    begin
      Blob.create(params[:blob])
    rescue
      p "oops"
    end
    render :text => hash
  end
  
  def reblobify
    params[:blob][:hash] = (hash = hashify(params[:blob][:content]))
    begin
      b = Blob.find_by_hash(params[:old_hash])
      b.update_attributes(params[:blob])
    rescue
      p "oops"
    end
    render :text => hash
  end
end