/* eslint-disable react/prop-types */
import { Box, Button, FormControl, FormControlLabel, FormHelperText, IconButton, InputLabel, MenuItem, Select, Stack, Switch, TextField, Typography } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import apiReq from "../../../utils/axiosReq";
import toast from "react-hot-toast";
import CButton from "../../common/CButton";
import { CloudUploadOutlined, DeleteOutlined } from "@mui/icons-material";
import useAuth from "../../hook/useAuth";
import { deleteFile, uploadFile } from "../../../utils/fileHandler";
import { useTranslation } from "react-i18next";

const UpdateLink = ({ closeDialog, linkData }) => {
  const [fileUploadLoading, setFileUploadLoading] = useState(false)
  const [error, setError] = useState('');
  const [file, setFile] = useState(null)
  const [formData, setFormData] = useState({
    slug: '',
    destinationUrl: '',
    description: '',
    buttonName: '',
    type: 'none',
    buttonColor: '#000000',
    googleLogin: 'inactive',
    image: '',
    isActive: true
  });
  
  const isUpdate = Boolean(linkData);

  const { t } = useTranslation('redirectLinks');

  const queryClient = useQueryClient();
  const { token } = useAuth();

  const createLinkMutation = useMutation({
    mutationFn: (linkData) => apiReq[isUpdate ? 'put' : 'post'](`api/link/${isUpdate ? `update/${linkData._id}` : 'create'}`, linkData, { headers: { Authorization: token } }),
    onSuccess: (res) => {
      toast.success(res.data.message);
      queryClient.invalidateQueries(['links']);
      closeDialog();
    },
    onError: (err) => {
      console.log('err', err);
      setError(err.response?.data);
    }
  });

  const handleSubmit = async () => {
    if (!formData.slug) {
      setError({ slug: 'Slug is required' });
      return;
    }
    if (!formData.destinationUrl) {
      setError({ destinationUrl: 'Destination URL is required' });
      return;
    }
    //destination url correct check
    if (!formData.destinationUrl.startsWith('http://') && !formData.destinationUrl.startsWith('https://')) {
      setError({ destinationUrl: 'Destination URL must start with https:// or http://' });
      return;
    }
    if (formData.googleLogin === 'active') {
      if (!formData.buttonName) {
        setError({ buttonName: 'Button Name is required' });
        return;
      }
      if (!formData.buttonColor) {
        setError({ buttonColor: 'Button Color is required' });
        return;
      }
      if (!formData.type) {
        setError({ type: 'Type is required' });
        return;
      }
    }
    if (!formData.slug.match(/^[a-zA-Z0-9_-]+$/)) {
      setError({ slug: 'Slug must contain only letters, numbers, underscores, and hyphens' });
      return;
    }
    if (file) {
      setFileUploadLoading(true)
      const data = await uploadFile(file, 'link')
      const publicId = linkData?.image.split('/').pop().split('.')[0]
      await deleteFile(publicId)
      formData.image = data.secure_url
      setFileUploadLoading(false)
    }
    setError({});
    createLinkMutation.mutate(formData);
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'isActive' ? checked : value
    }));
  };

  useEffect(() => {
    if (isUpdate) {
      setFormData({...linkData,buttonColor: linkData.buttonColor || '#000000'});
    }
  }, [linkData, isUpdate]);

  return (
    <Box>
      <Stack gap={2} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          name="slug"
          label={t('link_name')}
          placeholder="e.g. advertisement1"
          value={formData.slug}
          onChange={handleChange}
          error={Boolean(error.slug)}
          helperText={error.slug}
        />

        <TextField
          fullWidth
          name="destinationUrl"
          label={t('destination_url')}
          placeholder="e.g. https://client-site.com"
          value={formData.destinationUrl}
          onChange={handleChange}
          error={Boolean(error.destinationUrl)}
          helperText={error.destinationUrl}
        />
        <TextField
          fullWidth
          multiline
          rows={4}
          name="description"
          label={t('description')}
          value={formData.description}
          onChange={handleChange}
          error={Boolean(error.description)}
          helperText={error.description}
        />
        {
          formData.googleLogin === 'active' && (
            <Stack direction="row" gap={2}>
              <TextField
                fullWidth
                name="buttonName"
                label={t('button_name')}
                placeholder="e.g. advertisement1"
                value={formData.buttonName}
                onChange={handleChange}
                error={Boolean(error.buttonName)}
                helperText={error.buttonName}
              />
              <FormControl fullWidth>
                <InputLabel>{t('type')}</InputLabel>
                <Select
                  label={t('type')}

                  name="type"
                  error={Boolean(error.type)}
                  value={formData.type}
                  onChange={handleChange}
                >
                  <MenuItem value="none">None</MenuItem>
                  <MenuItem value="menú">Menú</MenuItem>
                  <MenuItem value="catálogo">Catálogo</MenuItem>
                  <MenuItem value="anuncio">Anuncio</MenuItem>
                  <MenuItem value="promoción">Promoción</MenuItem>
                </Select>
                <FormHelperText>{error.type}</FormHelperText>
              </FormControl>
              <TextField
                sx={{ width: '200px' }}
                type="color"
                name="buttonColor"
                placeholder="Enter button color"
                value={formData.buttonColor}
                onChange={handleChange}
              />
            </Stack>
          )
        }

        {
          (formData.googleLogin === 'active' || formData.googleLogin === 'optional') &&
          <Box>

            <Box sx={{
              border: '1px dashed grey',
              borderRadius: 1,
              p: 2,
              textAlign: 'center',
              position: 'relative'
            }}>
              {file || formData?.image ? (
                <Box>
                  <img
                    src={file ? URL.createObjectURL(file) : formData?.image}
                    alt="Link preview"
                    style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
                  />
                  <IconButton
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'rgba(255,255,255,0.8)'
                    }}
                    onClick={() => {
                      setFile(null);
                      setFormData(prev => ({
                        ...prev,
                        image: ''
                      }));
                    }}
                  >
                    <DeleteOutlined />
                  </IconButton>
                </Box>
              ) : (
                <Button
                  component="label"
                  variant="text"
                  startIcon={<CloudUploadOutlined />}
                >
                  {t('upload_image')}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setFile(e.target.files[0]);
                      }
                    }}
                  />
                </Button>
              )}
            </Box>
          </Box>
        }

        <Stack direction="row" gap={2} sx={{ mt: 2 }}>

          <FormControl sx={{ width: '200px' }}>
            <InputLabel>Google</InputLabel>
            <Select label="Google" value={formData.googleLogin} onChange={handleChange} name="googleLogin">
              <MenuItem value="inactive">{t('inactive')}</MenuItem>
              <MenuItem value="active">{t('active')}</MenuItem>
              <MenuItem value="optional">{t('optional')}</MenuItem>
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Switch
                checked={formData.isActive}
                onChange={handleChange}
                name="isActive"
              />
            }
            label='Active'
          />

        </Stack>

        <CButton
          loading={createLinkMutation.isPending || fileUploadLoading}
          fullWidth
          onClick={handleSubmit}
          variant="contained"
          sx={{ mt: 3 }}
        >
          {isUpdate ? t('update_link') : t('create_link')}
        </CButton>
      </Stack>
    </Box>
  );
};

export default UpdateLink;