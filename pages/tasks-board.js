
import React, { useState } from 'react';
import Layout from '../components/layout';
import Toolbar from '../components/toolbar';
import ListTaskBoard from '../components/list-task-board';
import { Fab, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import DialogMoreList from './../components/dialog-more-list';
import useFetch from '../hooks/useFetch';
import toast, { Toaster } from 'react-hot-toast';
import { useSession } from 'next-auth/client';
import {
    URL_API_ITEM,
    URL_API_LIST
}
    from '../lib/constants';

const useStyles = makeStyles((theme) => ({
    fab: {
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
        boxShadow: `0 0 5px ${theme.palette.secondary.main}`,
        zIndex: theme.z,
    }
}));

export default function TasksBoard() {

    const classes = useStyles();
    const [session, loading] = useSession();

    //States
    const [open, setOpen] = useState(false);
    const [currentEdit, setCurrentEdit] = useState('');

    //Data
    const { data, error, mutate } = useFetch(URL_API_LIST);

    if (error) return <div>Failed to load list</div>
    if (!data) return <div>Loading...</div>

    //Add list
    const onSubmit = async (dados, e) => {

        const res = await fetch(URL_API_LIST, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dados)
        })

        handleDialogToggle();

        if (res.ok) {
            mutate();
            toast.success("Successfully created!");
        } else {
            toast.error("This didn't work.");
        }

        e.target.reset();
    }

    const handleEdit = async (dados) => {

        const res = await fetch(URL_API_LIST + "/" + dados._id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dados)
        })

        if (res.ok) {
            mutate();
            setCurrentEdit('');
            toast.success("Successfully updated!");
        } else {
            toast.error("This didn't work.");
        }
    }

    //# DELETAR TASK
    const handleDelete = async (_id) => {
        const res = await fetch(URL_API_LIST + "/" + _id, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        })

        if (res.ok) {
            mutate();
            toast.success("Successfully deleted!");
        } else {
            toast.error("This didn't work.");
        }
    }

    //Open/Close Dialog
    const handleDialogToggle = () => {
        setOpen(!open);
    };

    if (!session) {
        return (
            <Layout>
                <Toolbar />
                <Typography variant="h5">
                    Login
                </Typography>
                <Typography variant="subtitle2">
                    You must be signed in to view this page
                </Typography>
            </Layout>
        )
    }

    return (
        <Layout>
            <Toaster />
            <Toolbar />
            <ListTaskBoard
                data={data?.data}
                handleDelete={handleDelete}
                handleEdit={handleEdit}
                currentEdit={currentEdit}
                setCurrentEdit={setCurrentEdit} />
            <Fab
                onClick={handleDialogToggle}
                aria-label="Add"
                className={classes.fab}
                color="secondary">
                <AddIcon />
            </Fab>
            <DialogMoreList
                open={open}
                handleDialogToggle={() => setOpen(!open)}
                onSubmit={onSubmit} />
        </Layout>
    )
}