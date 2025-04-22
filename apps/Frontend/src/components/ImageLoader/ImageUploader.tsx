const ImageUploader = ({onChange}) => {
  return (
    <div style={{ marginBottom: "20px" }}>
      <input type="file" accept="image/*" onChange={onChange} />
    </div>
  );
}

export default ImageUploader;
