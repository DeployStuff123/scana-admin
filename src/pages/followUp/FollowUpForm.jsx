/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'
import { Box, FormControl, FormControlLabel, TextField, Checkbox, Button, Stack, Autocomplete, Typography, Switch, IconButton, MenuItem, Select, InputLabel } from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiReq from '../../../utils/axiosReq'
import { Link } from 'react-router-dom'
import { CloudUploadOutlined, DeleteOutlined, ImageOutlined, Info } from '@mui/icons-material'
import { deleteFile, uploadFile } from '../../../utils/fileHandler'
import CButton from '../../common/CButton'
import toast from 'react-hot-toast'
import PropTypes from 'prop-types'
import useAuth from '../../hook/useAuth'
import { useTranslation } from 'react-i18next'


const FollowUpForm = ({ editData, closeDialog }) => {
  const [selectedLink, setSelectedLink] = useState(null)
  const [img, setImg] = useState('')
  const [fileUploadLoading, setFileUploadLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    attachment: {
      fileType: 'image',
      imageUrl: '',
      pdfUrl: ''
    },
    enabled: true,
    approved: true,
    link: '',
    destinationUrl: '',
    subject: '',
    delayInMinutes: 0,
    followUpType: 'casual',
    sendHour: '',
    scheduleType: 'daily',
    scheduleDay: 0,
    scheduleDate: 1
  })

  const { token } = useAuth()
  const { t } = useTranslation('followUp');

  const { data, isLoading } = useQuery({
    queryFn: async () => await apiReq.get('api/link/all', { headers: { Authorization: token } }),
    queryKey: ['links']
  });


  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (data) => {
      if (editData) {
        return await apiReq.put(`api/follow-up/update/${editData._id}`, data, { headers: { Authorization: token } })
      } else {
        return await apiReq.post('api/follow-up/create', data, { headers: { Authorization: token } })
      }
    },
    onSuccess: (res) => {
      toast.success(res.data.message)
      queryClient.invalidateQueries(['follow-ups'])
      closeDialog()
    },
    onError: (err) => {
      setError(err.response.data)
      console.log(err)
    }
  })

  const handleSubmit = async () => {
    if (!selectedLink) {
      setError({ slug: 'Please select a slug' })
      return
    }
    if (!formData.subject) {
      setError({ subject: 'Please enter a subject' })
      return
    }
    if (formData.destinationUrl && !formData.destinationUrl.startsWith('http://') && !formData.destinationUrl.startsWith('https://')) {
      setError({ destinationUrl: 'Destination URL must start with https:// or http://' });
      return;
    }
    if (formData.followUpType === 'scheduled') {
      if (!formData.sendHour) {
        setError({ sendHour: 'Please enter a send hour' })
        return
      }
      //send hour validation
      if (formData.sendHour < 0 || formData.sendHour > 23) {
        setError({ sendHour: 'Send hour must be between 0 and 23' })
        return
      }
      if (formData.scheduleType === 'weekly') {
        if (formData.scheduleDay === '') {
          setError({ scheduleDay: 'Please select a day of the week' })
          return
        }
      }
      if (formData.scheduleType === 'monthly') {
        if (!formData.scheduleDate) {
          setError({ scheduleDate: 'Please select a day of the month' })
          return
        }
      }
    }
    if (formData.attachment?.fileType === 'image') {
      if (!img && !formData.attachment.imageUrl) {
        setError({ img: 'Please upload an image' })
        return
      }
    }
    if (formData.attachment?.fileType === 'pdf') {
      if (!formData.attachment.pdfUrl) {
        setError({ pdfUrl: 'PDF link required' })
        return
      }
    }

    if (img && img !== formData.attachment.imageUrl) {
      setFileUploadLoading(true)
      const res = await uploadFile(img)
      setFileUploadLoading(false)
      formData.attachment.imageUrl = res.secure_url
      if (editData) {
        const publicId = editData.attachment.imageUrl?.split('/').pop().split('.')[0]
        await deleteFile(publicId)
      }
    }
    mutation.mutate({ ...formData, link: selectedLink._id })
  }
console.log(formData)
  // Pre-fill form if editing
  useEffect(() => {
    if (editData) {
      setFormData({
        attachment: {
          fileType: editData.attachment.fileType || 'image',
          imageUrl: editData.attachment.imageUrl || '',
          pdfUrl: editData.attachment.pdfUrl || ''
        },
        enabled: editData.enabled ?? true,
        approved: editData.approved ?? true,
        link: editData.link?._id || '',
        destinationUrl: editData.destinationUrl || '',
        subject: editData.subject || '',
        delayInMinutes: editData.delayInMinutes ?? 0,
        followUpType: editData.followUpType || 'casual',
        sendHour: editData.sendHour ?? '',
        scheduleType: editData.scheduleType || 'daily',
        scheduleDay: editData.scheduleDay,
        scheduleDate: editData.scheduleDate || ''
      })
      setSelectedLink(editData.link || null)
      // setImg(editData.attachment.imageUrl || '')
    }
  }, [editData])

  return (
    <Stack gap={2}>
      {/* Type Selector */}
      <FormControl fullWidth>
        <InputLabel id="followup-type-label">{t('follow_up_type')}</InputLabel>
        <Select
          labelId="followup-type-label"
          value={formData.followUpType}
          label={t('follow_up_type')}
          onChange={e => setFormData({ ...formData, followUpType: e.target.value })}
        >
          <MenuItem value="casual">{t('casual')}</MenuItem>
          <MenuItem value="scheduled">{t('scheduled')}</MenuItem>
        </Select>
      </FormControl>

      <Autocomplete
        disablePortal
        value={selectedLink}
        loading={isLoading}
        onChange={(e, value) => setSelectedLink(value)}
        options={data?.data || []}
        sx={{ width: '100%' }}
        getOptionLabel={(option) => option.slug}
        isOptionEqualToValue={(option, value) => option._id === value?._id}
        renderInput={(params) => <TextField error={!!error?.slug} helperText={error?.slug} {...params} label={t('select_link')} />}
        renderOption={(props, option) => (
          <Box {...props}>
            <Typography sx={{ border: '1px solid lightgray', borderRadius: 2, px: 2, py: .5, width: 'fit-content' }}>
              {option.slug}
            </Typography>
          </Box>
        )}
      />
      <TextField
        label={t('subject')}
        error={!!error?.subject}
        helperText={error?.subject}
        value={formData.subject}
        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
      />
      <TextField
        label={t('destination_url')}
        error={!!error?.destinationUrl}
        helperText={error?.destinationUrl}
        value={formData.destinationUrl}
        onChange={(e) => setFormData({ ...formData, destinationUrl: e.target.value })}
      />

      {/* Conditional fields */}
      {formData.followUpType === 'casual' && (
        <Box>
          <TextField
            fullWidth
            type="number"
            label="Delay in Minutes"
            error={!!error?.delayInMinutes}
            helperText={error?.delayInMinutes}
            value={formData.delayInMinutes}
            onChange={(e) => setFormData({ ...formData, delayInMinutes: e.target.value })}
          />
          <Typography sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }} variant='caption'>
            <Info sx={{ fontSize: '14px' }} />
            {t('delay_desc')}
          </Typography>
        </Box>
      )}

      {formData.followUpType === 'scheduled' && (
        <Stack gap={2}>
          <TextField
            fullWidth
            label={t('scheduled_hour')}
            placeholder="e.g. 20 = 8.00pm"
            type="number"
            value={formData.sendHour}
            onChange={e => setFormData({ ...formData, sendHour: e.target.value })}
            error={!!error?.sendHour}
            helperText={error?.sendHour}
          />
          <FormControl fullWidth>
            <InputLabel>{t('schedule_type')}</InputLabel>
            <Select
              value={formData.scheduleType}
              label={t('schedule_type')}
              onChange={e => setFormData({ ...formData, scheduleType: e.target.value })}
            >
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
            </Select>
          </FormControl>
          {formData.scheduleType === 'weekly' && (
            <FormControl error={!!error?.scheduleDay} helperText={error?.scheduleDay} fullWidth>
              <InputLabel>Day of Week</InputLabel>
              <Select
                value={formData.scheduleDay}
                label="Day of Week"
                onChange={e => setFormData({ ...formData, scheduleDay: e.target.value })}
              >
                <MenuItem value={0}>Sunday</MenuItem>
                <MenuItem value={1}>Monday</MenuItem>
                <MenuItem value={2}>Tuesday</MenuItem>
                <MenuItem value={3}>Wednesday</MenuItem>
                <MenuItem value={4}>Thursday</MenuItem>
                <MenuItem value={5}>Friday</MenuItem>
                <MenuItem value={6}>Saturday</MenuItem>
              </Select>
              {error?.scheduleDay && <Typography variant='caption' color='error'>{error?.scheduleDay}</Typography>}
            </FormControl>
          )}
          {formData.scheduleType === 'monthly' && (
            <FormControl error={!!error?.scheduleDate} helperText={error?.scheduleDate} fullWidth>
              <InputLabel>Day of Month</InputLabel>
              <Select
                value={formData.scheduleDate}
                label="Day of Month"
                onChange={e => setFormData({ ...formData, scheduleDate: e.target.value })}
              >
                {[...Array(31)].map((_, i) => (
                  <MenuItem key={i} value={i + 1}>{i + 1}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}


        </Stack>
      )}

      <FormControl>
        <InputLabel>Attachment Type</InputLabel>
        <Select
          value={formData.attachment.fileType}
          label="Attachment Type"
          onChange={e => setFormData({ ...formData, attachment: {...formData.attachment, fileType: e.target.value } })}
        >
          <MenuItem value="image">Image</MenuItem>
          <MenuItem value="pdf">pdf</MenuItem>
        </Select>
      </FormControl>

      {
        formData.attachment.fileType === 'pdf' && (
          <TextField
            label="pdf url"
            placeholder="e.g. https://example.com/pdf.pdf"
            error={!!error?.pdfUrl}
            helperText={error?.pdfUrl}
            value={formData.attachment.pdfUrl}
            onChange={(e) => setFormData({ ...formData, attachment: { fileType: formData.attachment.fileType, pdfUrl: e.target.value } })}
          />
        )
      }

      {/* Image upload and preview */}
      {
        formData.attachment.fileType === 'image' &&
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          p: 2,
          border: '2px dashed',
          borderColor: 'primary.main',
          borderRadius: 2,
          position: 'relative'
        }}>
          {img || formData.attachment.imageUrl ? (
            <>
              <Typography variant='caption'>{img?.name}</Typography>
              <Box
                component="img"
                src={img && img !== formData.attachment.imageUrl ? URL.createObjectURL(img) : formData.attachment.imageUrl}
                alt=""
                sx={{
                  width: 150,
                  height: 150,
                  borderRadius: 4,
                  objectFit: 'cover'
                }}
              />
              <IconButton
                onClick={() => { setImg(''); setFormData({ ...formData, attachment: { ...formData.attachment, imageUrl: '' } }) }}
                sx={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  bgcolor: 'error.main',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'error.dark'
                  }
                }}
              >
                <DeleteOutlined />
              </IconButton>
            </>
          ) : (
            <Box
              sx={{
                width: 150,
                height: 150,
                borderRadius: 4,
                bgcolor: 'grey.200',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ImageOutlined sx={{ fontSize: 60, color: 'grey.400' }} />
            </Box>
          )}
          <Button
            component="label"
            variant="outlined"
            startIcon={<CloudUploadOutlined />}
          >
            {t('upload_image')}
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => setImg(e.target.files[0])}
            />
          </Button>
          {error?.img && <Typography variant='caption' color='error'>{error?.img}</Typography>}
        </Box>
      }

      <FormControlLabel
        control={<Switch checked={formData.enabled} onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })} />}
        label="Enabled"
      />

      <CButton loading={mutation.isPending || fileUploadLoading} variant="contained" color="primary" onClick={handleSubmit}>{editData ? 'Update' : 'Submit'}</CButton>
    </Stack>
  )
}

export default FollowUpForm
