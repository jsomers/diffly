class Blob < ActiveRecord::Base
  def word_count
    self.raw.split(" ").length
  end
  
  def self.word_count
    Blob.all.collect(&:word_count).sum
  end
end
